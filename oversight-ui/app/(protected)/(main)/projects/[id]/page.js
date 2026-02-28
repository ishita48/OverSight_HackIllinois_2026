// projects/[id]/page.js
import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { founderProjects, founderNarratives } from "@/utils/schema";
import { eq, and, desc } from "drizzle-orm";
import ProjectOverviewClient from "./ProjectOverviewClient";

export default async function ProjectOverviewPage({ params }) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    // Fetch the project from the database
    const projectData = await db
      .select()
      .from(founderProjects)
      .where(
        and(eq(founderProjects.id, id), eq(founderProjects.userId, user.id))
      )
      .limit(1);

    if (!projectData || projectData.length === 0) {
      // Project not found - return error page
      return (
        <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#8B9DC3]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#D4735F]/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center justify-center px-4 py-20">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 bg-[#D4735F]/10 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-[#D4735F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-light text-[#2C2825]">
                project not found
              </h2>
              <p className="text-[#6B6560] font-light">
                this project doesn't exist or you don't have permission to view
                it
              </p>
              <a
                href="/projects"
                className="inline-block px-6 py-2 bg-gradient-to-r from-[#D4735F] to-[#B85A47] 
                         text-white rounded-xl hover:from-[#B85A47] hover:to-[#A04A37] 
                         transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                view all projects
              </a>
            </div>
          </div>
        </div>
      );
    }

    const project = projectData[0];

    // Fetch all sessions for this project
    const sessionsData = await db
      .select({
        id: founderNarratives.id,
        sessionId: founderNarratives.sessionId,
        sessionTitle: founderNarratives.sessionTitle,
        createdAt: founderNarratives.createdAt,
        mood: founderNarratives.mood,
        tags: founderNarratives.tags,
        quote: founderNarratives.quote,
        oneLiner: founderNarratives.oneLiner,
        feedbackJson: founderNarratives.feedbackJson,
        transcript: founderNarratives.transcript,
        sessionNumber: founderNarratives.sessionNumber,
      })
      .from(founderNarratives)
      .where(
        and(
          eq(founderNarratives.projectId, id),
          eq(founderNarratives.userId, user.id)
        )
      )
      .orderBy(desc(founderNarratives.createdAt));

    // Process the sessions data
    const processedSessions = sessionsData.map((session) => {
      let parsedFeedback = {};

      try {
        parsedFeedback =
          typeof session.feedbackJson === "string"
            ? JSON.parse(session.feedbackJson)
            : session.feedbackJson || {};
      } catch (error) {
        console.error("Error parsing feedback JSON:", error);
        parsedFeedback = {};
      }

      return {
        id: session.id,
        sessionId: session.sessionId,
        sessionTitle:
          session.sessionTitle ||
          parsedFeedback.sessionTitle ||
          "Untitled Session",
        createdAt: session.createdAt.toISOString(),
        mood: session.mood || parsedFeedback.mood || "reflective",
        tags: session.tags || [],
        quote: session.quote || parsedFeedback.keyQuote?.quote,
        oneLiner: session.oneLiner || parsedFeedback.oneLiner,
        feedbackJson: parsedFeedback,
        transcript: session.transcript,
        sessionNumber: session.sessionNumber || 1,
      };
    });

    // Calculate project stats
    const stats = {
      totalSessions: processedSessions.length,
      totalWords: processedSessions.reduce((acc, session) => {
        const sessionReflection = session.feedbackJson.sessionReflection || "";
        return acc + sessionReflection.split(" ").length;
      }, 0),
      moods: processedSessions.reduce((acc, session) => {
        const mood = session.mood || "unknown";
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {}),
      timeSpan: {
        start:
          processedSessions.length > 0
            ? processedSessions[processedSessions.length - 1].createdAt
            : null,
        end:
          processedSessions.length > 0 ? processedSessions[0].createdAt : null,
      },
    };

    // Prepare the project data for the client component
    const projectForClient = {
      id: project.id,
      name: project.name,
      description: project.description,
      currentStage: project.currentStage,
      createdAt: project.createdAt.toISOString(),
      updatedAt:
        project.updatedAt?.toISOString() || project.createdAt.toISOString(),
      sessionCount: project.sessionCount || processedSessions.length,
      sessions: processedSessions,
      stats,
      userName:
        user.firstName ||
        user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
        "Founder",
    };

    return <ProjectOverviewClient project={projectForClient} />;
  } catch (error) {
    console.error("Database error:", error);
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <p className="text-[#6B6560]">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }
}
