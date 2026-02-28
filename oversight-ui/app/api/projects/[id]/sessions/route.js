// app/api/projects/[id]/sessions/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { founderNarratives, founderProjects } from "@/utils/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params in Next.js 15
    const { id } = await params;

    // Verify project belongs to user
    const [project] = await db
      .select()
      .from(founderProjects)
      .where(
        and(eq(founderProjects.id, id), eq(founderProjects.userId, user.id))
      );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get all sessions with all new fields
    const sessions = await db
      .select()
      .from(founderNarratives)
      .where(eq(founderNarratives.projectId, id))
      .orderBy(founderNarratives.sessionNumber);

    // Transform sessions to include all fields and process for backward compatibility
    const transformedSessions = sessions.map((session) => {
      // Parse feedback for backward compatibility
      let feedback = {};
      let summary = "";
      try {
        feedback =
          typeof session.feedbackJson === "string"
            ? JSON.parse(session.feedbackJson)
            : session.feedbackJson || {};
        summary = feedback.sessionReflection || "";
      } catch (e) {
        console.error("Error parsing feedback:", e);
      }

      return {
        // Core fields
        id: session.id,
        sessionId: session.sessionId,
        sessionNumber: session.sessionNumber,
        sessionType: session.sessionType,
        sessionTitle: session.sessionTitle,
        projectName: session.projectName,
        mood: session.mood,
        tags: session.tags,
        createdAt: session.createdAt,

        // NEW: Story fields
        yourStory: session.yourStory || feedback.yourStory || "",
        storyVersion: session.storyVersion || feedback.storyVersion || 1,

        // NEW: Essence fields
        yourTruth:
          session.yourTruth || feedback.yourTruth || session.oneLiner || "",
        whatDrivesYou: session.whatDrivesYou || feedback.whatDrivesYou || [],

        // NEW: Moments fields
        turningPoint: session.turningPoint || feedback.turningPoint || null,
        theDoubt: session.theDoubt || feedback.theDoubt || null,
        theBreakthrough:
          session.theBreakthrough || feedback.theBreakthrough || null,
        keyQuotes: session.keyQuotes || feedback.keyQuotes || [],

        // NEW: DNA fields
        founderDNA:
          session.founderDNA ||
          feedback.founderDNA ||
          feedback.founderBio ||
          "",
        personalityTraits:
          session.personalityTraits || feedback.personalityTraits || [],

        // NEW: Tell it your way
        tellItYourWay: session.tellItYourWay ||
          feedback.tellItYourWay || {
            lightning: "",
            dinnerParty: "",
            websiteBio: "",
            investorPitch: "",
          },

        // NEW: Metrics
        narrativeDepth: session.narrativeDepth || feedback.narrativeDepth || 1,
        emotionalOpenness:
          session.emotionalOpenness || feedback.emotionalOpenness || 1,
        clarityScore: session.clarityScore || feedback.clarityScore || 1,

        // Keep for context building and backward compatibility
        transcript: session.transcript,
        feedbackJson: session.feedbackJson,

        // Legacy fields
        oneLiner: session.oneLiner || feedback.oneLiner || "",
        quote: session.quote || feedback.quote || "",

        // Processed summary
        summary: summary,
      };
    });

    // Calculate aggregate stats for the project
    const projectStats = {
      totalSessions: transformedSessions.length,
      averageNarrativeDepth:
        transformedSessions.reduce((sum, s) => sum + s.narrativeDepth, 0) /
          transformedSessions.length || 0,
      averageClarity:
        transformedSessions.reduce((sum, s) => sum + s.clarityScore, 0) /
          transformedSessions.length || 0,
      lastSessionDate:
        transformedSessions[transformedSessions.length - 1]?.createdAt,
      hasEvolvingStory: transformedSessions.some((s) => s.storyVersion > 1),
    };

    return NextResponse.json({
      projectName: project.name,
      projectId: project.id,
      currentStage: project.currentStage,
      storyDepth: project.storyDepth,
      sessions: transformedSessions,
      stats: projectStats,
      count: transformedSessions.length,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
