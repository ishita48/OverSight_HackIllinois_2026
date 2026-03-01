import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import {
  founderNarratives,
  founderProjects,
  storyEvolution,
  narrativeThemes,
} from "@/utils/schema";
import { eq, and, sql } from "drizzle-orm";
import { createProject } from "@/utils/db-helpers";

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ NEW FIELDS ADDED HERE
    const {
      userId,
      sessionId,
      transcript,
      feedbackJson,
      projectId,
      billAnalysis,
      negotiationEmail,
    } = body;

    if (!userId || !sessionId || !transcript || !feedbackJson) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const feedback =
      typeof feedbackJson === "string"
        ? JSON.parse(feedbackJson)
        : feedbackJson;

    let finalProjectId = projectId;

    // =============================
    // Project Creation / Update
    // =============================
    if (!projectId) {
      const project = await createProject({
        userId,
        name: feedback.projectName || "Untitled Project",
        description:
          feedback.tellItYourWay?.dinnerParty || feedback.yourTruth || "",
        currentStage: feedback.projectStage || "idea",
        lastSessionSummary: feedback.sessionReflection || "",
        sessionCount: 1,
        storyDepth: feedback.narrativeDepth || 1,
        lastMood: feedback.mood || "reflective",
      });

      finalProjectId = project.id;
    } else {
      await db
        .update(founderProjects)
        .set({
          lastSessionSummary: feedback.sessionReflection || "",
          currentStage:
            feedback.projectStage ||
            sql`${founderProjects.currentStage}`,
          sessionCount: sql`${founderProjects.sessionCount} + 1`,
          storyDepth: Math.max(
            parseInt(feedback.narrativeDepth) || 1,
            1
          ),
          lastMood:
            feedback.mood || sql`${founderProjects.lastMood}`,
          updatedAt: new Date(),
        })
        .where(eq(founderProjects.id, projectId));
    }

    // =============================
    // Session Number
    // =============================
    const existingSessions = await db
      .select()
      .from(founderNarratives)
      .where(eq(founderNarratives.projectId, finalProjectId));

    const sessionNumber = existingSessions.length + 1;

    // =============================
    // MAIN SAVE ✅
    // =============================
    await db.insert(founderNarratives).values({
      userId,
      sessionId,
      projectId: finalProjectId,
      sessionNumber,

      sessionType: feedback.sessionType || "general",
      transcript,

      feedbackJson:
        typeof feedbackJson === "string"
          ? feedbackJson
          : JSON.stringify(feedbackJson),

      sessionTitle:
        feedback.sessionTitle || `Session ${sessionNumber}`,
      projectName:
        feedback.projectName || "Untitled Project",
      mood: feedback.mood || "reflective",
      tags: feedback.tags || [],

      yourStory: feedback.yourStory || "",
      storyVersion: feedback.storyVersion || 1,

      yourTruth: feedback.yourTruth || "",
      whatDrivesYou: feedback.whatDrivesYou || [],

      turningPoint: feedback.turningPoint || null,
      theDoubt: feedback.theDoubt || null,
      theBreakthrough: feedback.theBreakthrough || null,
      keyQuotes: feedback.keyQuotes || [],

      founderDNA: feedback.founderDNA || "",
      personalityTraits: feedback.personalityTraits || [],

      tellItYourWay: feedback.tellItYourWay || {
        lightning: "",
        dinnerParty: "",
        websiteBio: "",
        investorPitch: "",
      },

      narrativeDepth: feedback.narrativeDepth || 1,
      emotionalOpenness: feedback.emotionalOpenness || 1,
      clarityScore: feedback.clarityScore || 1,

      oneLiner:
        feedback.yourTruth || feedback.oneLiner || "",
      quote:
        feedback.keyQuotes?.[0]?.quote ||
        feedback.quote ||
        "",

      createdAt: new Date(),

      // ✅ =========================
      // ✅ MEDICAL ADVOCACY SAVE
      // ✅ =========================
      billAnalysis: billAnalysis ?? null,
      negotiationEmail: negotiationEmail ?? null,
    });

    // =============================
    // Story Evolution
    // =============================
    if (feedback.storyEvolutions?.length) {
      for (const evolution of feedback.storyEvolutions) {
        await db.insert(storyEvolution).values({
          projectId: finalProjectId,
          sessionNumber,
          evolutionType: evolution.type,
          fromValue: evolution.from || "",
          toValue: evolution.to || "",
          reason: evolution.reason || "",
          impact: evolution.impact || "",
          createdAt: new Date(),
        });
      }
    }

    // =============================
    // Narrative Themes
    // =============================
    if (feedback.whatDrivesYou?.length) {
      for (const driver of feedback.whatDrivesYou) {
        const existingTheme = await db
          .select()
          .from(narrativeThemes)
          .where(
            and(
              eq(narrativeThemes.projectId, finalProjectId),
              eq(narrativeThemes.theme, driver.theme)
            )
          )
          .limit(1);

        if (existingTheme.length > 0) {
          await db
            .update(narrativeThemes)
            .set({
              description: driver.description,
              lastReinforced: sessionNumber,
              strength: sql`LEAST(${narrativeThemes.strength}+1,10)`,
              updatedAt: new Date(),
            })
            .where(
              eq(narrativeThemes.id, existingTheme[0].id)
            );
        } else {
          await db.insert(narrativeThemes).values({
            projectId: finalProjectId,
            theme: driver.theme,
            description: driver.description,
            firstAppeared: sessionNumber,
            lastReinforced: sessionNumber,
            strength: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    return NextResponse.json(
      {
        message: "Saved successfully.",
        projectId: finalProjectId,
        sessionNumber,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving narrative:", err);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err.message,
      },
      { status: 500 }
    );
  }
}