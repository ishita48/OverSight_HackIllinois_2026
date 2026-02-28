import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/utils/db";
import { founderNarratives, userProfiles } from "@/utils/schema";
import { eq } from "drizzle-orm";
import PublicShareClient from "./PublicShareClient";

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const narrativeData = await db
      .select({
        sessionTitle: founderNarratives.sessionTitle,
        projectName: founderNarratives.projectName,
        oneLiner: founderNarratives.oneLiner,
        quote: founderNarratives.quote,
        feedbackJson: founderNarratives.feedbackJson,
      })
      .from(founderNarratives)
      .where(eq(founderNarratives.sessionId, id))
      .limit(1);

    if (!narrativeData || narrativeData.length === 0) {
      return {
        title: "Story Not Found - BackStory",
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

    const title =
      parsedFeedback.sessionTitle || narrative.sessionTitle || "Founder Story";
    const description =
      parsedFeedback.sessionReflection ||
      parsedFeedback.oneLiner ||
      narrative.oneLiner ||
      "A founder's authentic journey and insights.";
    const quote = parsedFeedback.keyQuote?.quote || narrative.quote;

    return {
      title: `${title} - BackStory`,
      description:
        description.slice(0, 160) + (description.length > 160 ? "..." : ""),
      openGraph: {
        title: title,
        description:
          description.slice(0, 160) + (description.length > 160 ? "..." : ""),
        type: "article",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/session/${id}/share`,
        siteName: "BackStory",
        images: [
          {
            url: `${
              process.env.NEXT_PUBLIC_APP_URL
            }/api/og?title=${encodeURIComponent(
              title
            )}&quote=${encodeURIComponent(quote || "")}`,
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
        images: [
          `${process.env.NEXT_PUBLIC_APP_URL}/api/og?title=${encodeURIComponent(
            title
          )}&quote=${encodeURIComponent(quote || "")}`,
        ],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Founder Story - BackStory",
      description: "Discover authentic founder stories and insights.",
    };
  }
}

export default async function PublicSharePage({ params }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  try {
    // Fetch the narrative from the database (no user restriction for public sharing)
    const narrativeData = await db
      .select()
      .from(founderNarratives)
      .where(eq(founderNarratives.sessionId, id))
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
      // If feedback is corrupted, don't show the public page
      notFound();
    }

    // Get founder info for proper public URL generation
    let founderInfo = null;
    try {
      const founderData = await db
        .select({
          name: userProfiles.name,
          username: userProfiles.username,
        })
        .from(userProfiles)
        .where(eq(userProfiles.clerkUserId, narrative.userId))
        .limit(1);

      if (founderData && founderData.length > 0) {
        founderInfo = founderData[0];
      }
    } catch (error) {
      console.log("Could not fetch founder info:", error);
    }

    // Prepare the narrative data for the client component
    const narrativeForClient = {
      id: narrative.id,
      sessionId: narrative.sessionId,
      sessionTitle:
        feedbackJson.sessionTitle ||
        narrative.sessionTitle ||
        "Untitled Session",
      projectName:
        feedbackJson.projectName || narrative.projectName || "My Project",
      createdAt: narrative.createdAt.toISOString(),
      mood: feedbackJson.mood || narrative.mood || "reflective",
      tags: feedbackJson.tags || narrative.tags || [],
      quote:
        feedbackJson.keyQuote?.quote ||
        feedbackJson.quote ||
        narrative.quote ||
        "",
      oneLiner: feedbackJson.oneLiner || narrative.oneLiner || "",
      founderName: founderInfo?.name || founderInfo?.username || "founder",
      feedbackJson,
    };

    return <PublicShareClient narrative={narrativeForClient} />;
  } catch (error) {
    console.error("Database error:", error);
    notFound();
  }
}
