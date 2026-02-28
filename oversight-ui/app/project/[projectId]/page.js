// u/[projectId]/page.js
import React from "react";
import { db } from "@/utils/db";
import { founderProjects, founderNarratives, users } from "@/utils/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProjectPublicClient from "./ProjectPublicClient";

export default async function PublicProjectPage({ params }) {
  const { projectId } = await params;

  try {
    // Fetch the project from the database
    const projectData = await db
      .select({
        id: founderProjects.id,
        name: founderProjects.name,
        description: founderProjects.description,
        currentStage: founderProjects.currentStage,
        createdAt: founderProjects.createdAt,
        updatedAt: founderProjects.updatedAt,
        sessionCount: founderProjects.sessionCount,
        userId: founderProjects.userId,
        isPublic: founderProjects.isPublic,
      })
      .from(founderProjects)
      .where(eq(founderProjects.id, projectId))
      .limit(1);

    if (!projectData || projectData.length === 0) {
      notFound();
    }

    const project = projectData[0];

    // Check if project is public (we'll add this field to the schema)
    // For now, we'll assume all projects are shareable
    
    // Fetch the project owner's public info (we'll need to add this to users table)
    // For now, we'll use a placeholder

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
        sessionNumber: founderNarratives.sessionNumber,
      })
      .from(founderNarratives)
      .where(eq(founderNarratives.projectId, projectId))
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
        sessionTitle: session.sessionTitle || parsedFeedback.sessionTitle || "Untitled Session",
        createdAt: session.createdAt.toISOString(),
        mood: session.mood || parsedFeedback.mood || "reflective",
        tags: session.tags || [],
        quote: session.quote || parsedFeedback.keyQuote?.quote,
        oneLiner: session.oneLiner || parsedFeedback.oneLiner,
        feedbackJson: parsedFeedback,
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
        start: processedSessions.length > 0 ? processedSessions[processedSessions.length - 1].createdAt : null,
        end: processedSessions.length > 0 ? processedSessions[0].createdAt : null,
      },
    };

    // Prepare the project data for the client component
    const projectForClient = {
      id: project.id,
      name: project.name,
      description: project.description,
      currentStage: project.currentStage,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt?.toISOString() || project.createdAt.toISOString(),
      sessionCount: project.sessionCount || processedSessions.length,
      sessions: processedSessions,
      stats,
      ownerName: "Founder", // We'll enhance this later with actual user data
    };

    return <ProjectPublicClient project={projectForClient} />;
  } catch (error) {
    console.error("Database error:", error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { projectId } = await params;

  try {
    const projectData = await db
      .select({
        name: founderProjects.name,
        description: founderProjects.description,
      })
      .from(founderProjects)
      .where(eq(founderProjects.id, projectId))
      .limit(1);

    if (!projectData || projectData.length === 0) {
      return {
        title: "Project Not Found - BackStory",
        description: "The project you're looking for doesn't exist.",
      };
    }

    const project = projectData[0];

    return {
      title: `${project.name} - Founder Story | BackStory`,
      description: project.description || `Discover the founder story behind ${project.name}`,
      openGraph: {
        title: `${project.name} - Founder Story`,
        description: project.description || `Discover the founder story behind ${project.name}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.name} - Founder Story`,
        description: project.description || `Discover the founder story behind ${project.name}`,
      },
    };
  } catch (error) {
    return {
      title: "BackStory - Founder Narratives",
      description: "Discover authentic founder stories and startup journeys.",
    };
  }
}
