import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { founderNarratives } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import SessionsClient from "./SessionsClient";

export default async function SessionsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    // Fetch all sessions for the current user from the database
    const sessionsData = await db
      .select({
        id: founderNarratives.id,
        sessionId: founderNarratives.sessionId,
        sessionTitle: founderNarratives.sessionTitle,
        projectName: founderNarratives.projectName,
        createdAt: founderNarratives.createdAt,
        mood: founderNarratives.mood,
        tags: founderNarratives.tags,
        quote: founderNarratives.quote,
        oneLiner: founderNarratives.oneLiner,
        feedbackJson: founderNarratives.feedbackJson,
      })
      .from(founderNarratives)
      .where(eq(founderNarratives.userId, user.id))
      .orderBy(desc(founderNarratives.createdAt));

    // Process the sessions data for the client
    const processedSessions = sessionsData.map((session) => {
      let parsedFeedback = {};

      try {
        parsedFeedback =
          typeof session.feedbackJson === "string"
            ? JSON.parse(session.feedbackJson)
            : session.feedbackJson || {};
      } catch (error) {
        console.error(
          "Error parsing feedback JSON for session:",
          session.id,
          error
        );
        parsedFeedback = {};
      }

      return {
        id: session.id,
        sessionId: session.sessionId,
        // Use feedbackJson data as primary source, fallback to direct DB fields
        sessionTitle:
          parsedFeedback.sessionTitle ||
          session.sessionTitle ||
          "Untitled Session",
        projectName:
          parsedFeedback.projectName || session.projectName || "My Project",
        createdAt: session.createdAt.toISOString(),
        mood: parsedFeedback.mood || session.mood || "reflective",
        tags: parsedFeedback.tags || session.tags || [],
        quote:
          parsedFeedback.keyQuote?.quote ||
          parsedFeedback.quote ||
          session.quote ||
          "",
        oneLiner: parsedFeedback.oneLiner || session.oneLiner || "",
        sessionReflection: parsedFeedback.sessionReflection || "",
        keyQuote: parsedFeedback.keyQuote?.quote || session.quote || "",
        emotionalTone: parsedFeedback.emotionalTone || "",
        founderBio: parsedFeedback.founderBio || "",
        elevatorPitch: parsedFeedback.elevatorPitch || "",
        whyNowWhyMe: parsedFeedback.whyNowWhyMe || "",
        recurringThemes: parsedFeedback.recurringThemes || [],
        standoutMoments: parsedFeedback.standoutMoments || [],
        nextPrompt: parsedFeedback.nextPrompt || "",
      };
    });

    // Calculate some stats for the dashboard
    const stats = {
      totalSessions: processedSessions.length,
      thisMonth: processedSessions.filter((session) => {
        const sessionDate = new Date(session.createdAt);
        const now = new Date();
        return (
          sessionDate.getMonth() === now.getMonth() &&
          sessionDate.getFullYear() === now.getFullYear()
        );
      }).length,
      mostCommonMood:
        processedSessions.length > 0
          ? processedSessions.reduce((acc, session) => {
              const mood = session.mood || "unknown";
              acc[mood] = (acc[mood] || 0) + 1;
              return acc;
            }, {})
          : {},
      recentProjects: [
        ...new Set(
          processedSessions
            .slice(0, 5)
            .map((s) => s.projectName)
            .filter(Boolean)
        ),
      ],
    };

    return (
      <SessionsClient
        sessions={processedSessions}
        stats={stats}
        userName={
          user.firstName ||
          user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
          "there"
        }
      />
    );
  } catch (error) {
    console.error("Database error:", error);

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-gray-400">
            We encountered an error loading your sessions. Please try again.
          </p>
          <a
            href="/home"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }
}
