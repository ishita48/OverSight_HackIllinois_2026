import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { founderProjects, founderNarratives } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { generateProfileInsightPrompt } from "@/utils/generateFounderProfilePrompt";
import { chatSession } from "@/utils/GeminiAIModel";
import { saveProfileSnapshot } from "@/utils/profileSnapshotManager";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get all user's projects
    const userProjects = await db
      .select()
      .from(founderProjects)
      .where(eq(founderProjects.userId, userId));

    if (userProjects.length === 0) {
      return NextResponse.json(
        {
          error: "No projects found",
          isEmpty: true,
        },
        { status: 404 }
      );
    }

    // 2. Get all sessions for all projects
    const projectIds = userProjects.map((p) => p.id);
    const allSessions = [];

    for (const projectId of projectIds) {
      const projectSessions = await db
        .select()
        .from(founderNarratives)
        .where(
          and(
            eq(founderNarratives.projectId, projectId),
            eq(founderNarratives.userId, userId)
          )
        );

      allSessions.push(...projectSessions);
    }

    if (allSessions.length === 0) {
      return NextResponse.json(
        {
          error: "No sessions found",
          isEmpty: true,
        },
        { status: 404 }
      );
    }

    // 3. Enrich sessions with feedback and basic data
    const enrichedSessions = allSessions.map((session) => {
      try {
        return {
          ...session,
          // Parse feedback JSON if it exists
          feedback: session.feedbackJson ? session.feedbackJson : null,
          // Find the associated project
          project: userProjects.find((p) => p.id === session.projectId),
          // Extract basic rich context from session data
          richContext: {
            wordCount: session.transcript?.split(" ").length || 0,
            sessionNumber: session.sessionNumber || 1,
            mood: session.mood || "reflective",
          },
        };
      } catch (error) {
        console.error(`Error enriching session ${session.id}:`, error);
        return {
          ...session,
          feedback: session.feedbackJson ? session.feedbackJson : null,
          project: userProjects.find((p) => p.id === session.projectId),
          richContext: {
            wordCount: 0,
            sessionNumber: 1,
            mood: "reflective",
          },
        };
      }
    });

    // 4. Group sessions by project for better organization
    const projectsWithSessions = userProjects.map((project) => ({
      ...project,
      sessions: enrichedSessions.filter(
        (session) => session.projectId === project.id
      ),
    }));

    // 5. Generate founder profile using Gemini
    const prompt = generateProfileInsightPrompt(projectsWithSessions);
    console.log(
      "Generated prompt for Gemini:",
      prompt.substring(0, 200) + "..."
    );

    const result = await chatSession.sendMessage(prompt);
    const responseText = (await result.response.text())
      .replace("```json", "")
      .replace("```", "")
      .trim();

    console.log("Gemini response:", responseText.substring(0, 200) + "...");

    let geminiResponse;
    try {
      geminiResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.error("Raw response:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // 6. Add metadata for the profile page
    const profileData = {
      ...geminiResponse,
      metadata: {
        totalSessions: allSessions.length,
        totalProjects: userProjects.length,
        totalWords: enrichedSessions.reduce(
          (sum, session) => sum + (session.richContext?.wordCount || 0),
          0
        ),
        dateRange: {
          first: allSessions.reduce((earliest, session) =>
            !earliest ||
            new Date(session.createdAt) < new Date(earliest.createdAt)
              ? session
              : earliest
          ).createdAt,
          latest: allSessions.reduce((latest, session) =>
            !latest || new Date(session.createdAt) > new Date(latest.createdAt)
              ? session
              : latest
          ).createdAt,
        },
        projects: projectsWithSessions.map((project) => ({
          id: project.id,
          title: project.name,
          sessionCount: project.sessions.length,
          stage: project.currentStage,
          lastSession: project.sessions[project.sessions.length - 1]?.createdAt,
        })),
      },
    };

    // 7. Save profile snapshot for public profile and comparison
    try {
      await saveProfileSnapshot(userId, profileData);
      console.log(`Profile snapshot saved for user ${userId}`);
    } catch (snapshotError) {
      console.error("Failed to save profile snapshot:", snapshotError);
      // Don't fail the entire request if snapshot saving fails
    }

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error generating founder profile:", error);
    return NextResponse.json(
      { error: "Failed to generate profile", details: error.message },
      { status: 500 }
    );
  }
}
