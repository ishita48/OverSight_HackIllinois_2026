// app/u/[username]/page.js
import { notFound } from "next/navigation";
import PublicProfileClient from "./PublicProfileClient";
import { db } from "@/utils/db";
import { userProfiles } from "@/utils/schema";
import { eq, like } from "drizzle-orm";
import { generateUsernameFromEmail } from "@/utils/usernameHelper";

export async function generateMetadata({ params }) {
  const { username } = params;

  try {
    // Find user by email prefix (since username = email prefix)
    const users = await db
      .select()
      .from(userProfiles)
      .where(like(userProfiles.email, `${username}@%`))
      .limit(1);

    if (users.length === 0) {
      return {
        title: "Profile Not Found | OverSight",
        description: "The requested profile could not be found.",
      };
    }

    // Get latest profile snapshot for richer metadata
    const { getLatestProfileSnapshot } = await import(
      "@/utils/profileSnapshotManager"
    );
    const profileSnapshot = await getLatestProfileSnapshot(
      users[0].clerkUserId
    );

    const name = users[0].name || username;
    const title = `${name}'s Founder Journey | OverSight`;
    const description = profileSnapshot?.profileData?.headlineTruth
      ? `"${profileSnapshot.profileData.headlineTruth}" - Explore ${name}'s founder journey on OverSight.`
      : `Explore ${name}'s founder journey and insights on OverSight.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
        images: users[0].imageUrl
          ? [
              {
                url: users[0].imageUrl,
                width: 1200,
                height: 630,
                alt: `${name}'s profile picture`,
              },
            ]
          : [
              {
                url: "/api/og-image?name=" + encodeURIComponent(name),
                width: 1200,
                height: 630,
                alt: `${name}'s OverSight profile`,
              },
            ],
        siteName: "OverSight",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: users[0].imageUrl
          ? [users[0].imageUrl]
          : ["/api/og-image?name=" + encodeURIComponent(name)],
      },
      keywords: [
        "founder",
        "entrepreneurship",
        "startup",
        "journey",
        "story",
        name,
      ],
      authors: [{ name }],
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "OverSight Profile",
      description: "Explore founder journeys on OverSight.",
    };
  }
}

export default async function PublicProfilePage({ params }) {
  const { username } = params;

  try {
    // Find user by email prefix (since username = email prefix)
    const users = await db
      .select()
      .from(userProfiles)
      .where(like(userProfiles.email, `${username}@%`))
      .limit(1);

    if (users.length === 0) {
      notFound();
    }

    const user = users[0];

    return (
      <PublicProfileClient
        username={username}
        userId={user.clerkUserId}
        userProfile={user}
      />
    );
  } catch (error) {
    console.error("Error loading public profile:", error);
    notFound();
  }
}
