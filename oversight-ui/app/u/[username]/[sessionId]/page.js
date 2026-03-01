import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/utils/db";
import { founderNarratives, userProfiles } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import EpicPublicClient from "./EpicPublicClient";

// Generate EPIC metadata for social sharing
export async function generateMetadata({ params }) {
  const { username, sessionId } = await params;

  try {
    // Get user by username (assuming we store username or use email prefix)
    const userData = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.email, `${username}@`)) // This needs proper username logic
      .limit(1);

    const narrativeData = await db
      .select()
      .from(founderNarratives)
      .where(eq(founderNarratives.sessionId, sessionId))
      .limit(1);

    if (!narrativeData || narrativeData.length === 0) {
      return {
        title: "Founder Story Not Found - OverSight",
        description: "This founder story could not be found.",
      };
    }

    const narrative = narrativeData[0];
    let parsedFeedback = {};

    try {
      parsedFeedback =
        typeof narrative.feedbackJson === "string"
          ? JSON.parse(narrative.feedbackJson)
          : narrative.feedbackJson || {};
    } catch (error) {
      parsedFeedback = {};
    }

    const title = parsedFeedback.sessionTitle || "An Epic Founder Story";
    const description =
      parsedFeedback.sessionReflection ||
      parsedFeedback.oneLiner ||
      "A founder's authentic journey and breakthrough moments.";
    const quote = parsedFeedback.keyQuote?.quote;

    return {
      title: `${title} - OverSight`,
      description:
        description.slice(0, 160) + (description.length > 160 ? "..." : ""),
      openGraph: {
        title: title,
        description:
          description.slice(0, 160) + (description.length > 160 ? "..." : ""),
        type: "article",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/u/${username}/${sessionId}`,
        siteName: "OverSight",
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og/${sessionId}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description:
          description.slice(0, 160) + (description.length > 160 ? "..." : ""),
        images: [`${process.env.NEXT_PUBLIC_APP_URL}/api/og/${sessionId}`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Epic Founder Story - OverSight",
      description:
        "Discover authentic founder stories and breakthrough moments.",
    };
  }
}

export default async function PublicSharePage({ params }) {
  const { username, sessionId } = await params;

  if (!sessionId) {
    notFound();
  }

  try {
    // Fetch the narrative (public, no auth needed)
    const narrativeData = await db
      .select()
      .from(founderNarratives)
      .where(eq(founderNarratives.sessionId, sessionId))
      .limit(1);

    if (!narrativeData || narrativeData.length === 0) {
      notFound();
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
      notFound();
    }

    // Get founder info (optional - if user has public profile)
    let founderInfo = null;
    try {
      const founderData = await db
        .select({
          name: userProfiles.name,
          imageUrl: userProfiles.imageUrl,
        })
        .from(userProfiles)
        .where(eq(userProfiles.clerkUserId, narrative.userId))
        .limit(1);

      if (founderData && founderData.length > 0) {
        founderInfo = founderData[0];
      }
    } catch (error) {
      // Continue without founder info if error
      console.log("Could not fetch founder info:", error);
    }

    // Prepare EPIC narrative data
    const epicNarrative = {
      sessionId: narrative.sessionId,
      sessionTitle: feedbackJson.sessionTitle || "Untitled Story",
      projectName: feedbackJson.projectName || "Startup Journey",
      createdAt: narrative.createdAt.toISOString(),
      mood: feedbackJson.mood || "determined",
      tags: feedbackJson.tags || [],
      founderName: founderInfo?.name || username,
      founderImage: founderInfo?.imageUrl,
      feedbackJson,
    };

    return <EpicPublicClient narrative={epicNarrative} />;
  } catch (error) {
    console.error("Database error:", error);
    notFound();
  }
}
