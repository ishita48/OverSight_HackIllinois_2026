// session/[id]/report/page.js
import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { founderNarratives, founderProjects } from "@/utils/schema";
import { eq, and, desc } from "drizzle-orm";
import SessionReportClient from "./SessionReportClient";

export default async function SessionReportPage({ params }) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    // Fetch the narrative from the database
    const narrativeData = await db
      .select()
      .from(founderNarratives)
      .where(
        and(
          eq(founderNarratives.sessionId, id),
          eq(founderNarratives.userId, user.id)
        )
      )
      .limit(1);
    console.log("Narrative Data:", narrativeData);
    if (!narrativeData || narrativeData.length === 0) {
      // Session not found - return error page
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
                story not found
              </h2>
              <p className="text-[#6B6560] font-light">
                this chapter doesn't exist or you don't have permission to view
                it
              </p>
              <a
                href="/sessions"
                className="inline-block px-6 py-2 bg-gradient-to-r from-[#D4735F] to-[#B85A47] 
                         text-white rounded-xl hover:from-[#B85A47] hover:to-[#A04A37] 
                         transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                view all stories
              </a>
            </div>
          </div>
        </div>
      );
    }

    const narrative = narrativeData[0];

    // Parse the feedback JSON
    let feedbackJson;
    try {
      feedbackJson =
        typeof narrative.feedbackJson === "string"
          ? JSON.parse(narrative.feedbackJson)
          : narrative.feedbackJson;
    } catch (error) {
      console.error("Error parsing feedback JSON:", error);
      feedbackJson = {};
    }

    // Get total sessions for this project (if part of a project)
    let totalSessions = 1;
    let projectData = null;

    if (narrative.projectId) {
      // Get project info
      const [project] = await db
        .select()
        .from(founderProjects)
        .where(eq(founderProjects.id, narrative.projectId));

      projectData = project;
      totalSessions = project?.sessionCount || 1;
    }

    // Prepare the narrative data for the client component
    const narrativeForClient = {
      id: narrative.id,
      sessionId: narrative.sessionId,
      sessionNumber: narrative.sessionNumber || 1,
      projectId: narrative.projectId,
      projectName:
        projectData?.name ||
        feedbackJson.projectName ||
        narrative.projectName ||
        "My Project",
      sessionTitle:
        feedbackJson.sessionTitle ||
        narrative.sessionTitle ||
        "Untitled Session",
      createdAt: narrative.createdAt.toISOString(),
      mood: feedbackJson.mood || narrative.mood || "reflective",
      totalSessions,
      feedbackJson,
    };

    return <SessionReportClient narrative={narrativeForClient} />;
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
