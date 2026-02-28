import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/db";
import {
  founderProjects,
  founderNarratives,
  userProfiles,
} from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import HomeClient from "./HomeClient";
import ErrorBoundary from "@/components/home/ErrorBoundary";

export const metadata = {
  title: "Home - BackStory",
  description:
    "Your voice-first founder storytelling dashboard. Continue your projects and start new story sessions.",
};

async function getUserProjects(userId) {
  try {
    const projects = await db
      .select()
      .from(founderProjects)
      .where(eq(founderProjects.userId, userId))
      .orderBy(desc(founderProjects.updatedAt));

    return projects;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
}

async function getUserSessions(userId) {
  try {
    const sessions = await db
      .select()
      .from(founderNarratives)
      .where(eq(founderNarratives.userId, userId))
      .orderBy(desc(founderNarratives.createdAt))
      .limit(10);

    return sessions;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return [];
  }
}

async function getUserStats(userId) {
  try {
    const [sessions, projects] = await Promise.all([
      db
        .select()
        .from(founderNarratives)
        .where(eq(founderNarratives.userId, userId)),
      db
        .select()
        .from(founderProjects)
        .where(eq(founderProjects.userId, userId)),
    ]);

    // Calculate sessions this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sessionsThisMonth = sessions.filter(
      (session) => new Date(session.createdAt) >= startOfMonth
    ).length;

    // Most common mood
    const moodCounts = sessions.reduce((acc, session) => {
      if (session.mood) {
        acc[session.mood] = (acc[session.mood] || 0) + 1;
      }
      return acc;
    }, {});

    const mostCommonMood =
      Object.keys(moodCounts).length > 0
        ? Object.keys(moodCounts).reduce((a, b) =>
            moodCounts[a] > moodCounts[b] ? a : b
          )
        : "reflective";

    // Projects in progress (not in final stages)
    const projectsInProgress = projects.filter(
      (project) => !["launched", "pivoting"].includes(project.currentStage)
    ).length;

    return {
      totalSessions: sessions.length,
      sessionsThisMonth,
      mostCommonMood: mostCommonMood || "reflective",
      projectsInProgress,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      totalSessions: 0,
      sessionsThisMonth: 0,
      mostCommonMood: "reflective",
      projectsInProgress: 0,
    };
  }
}

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has completed onboarding
  const userProfile = await db
    .select({ hasOnboarded: userProfiles.hasOnboarded })
    .from(userProfiles)
    .where(eq(userProfiles.clerkUserId, userId))
    .limit(1);

  if (userProfile.length > 0 && !userProfile[0].hasOnboarded) {
    redirect("/onboarding");
  }

  // Fetch all data in parallel
  const [projects, sessions, stats] = await Promise.all([
    getUserProjects(userId),
    getUserSessions(userId),
    getUserStats(userId),
  ]);

  // Determine user state
  const hasProjects = projects.length > 0;
  const hasSessions = sessions.length > 0;
  const isFirstTime = !hasProjects && !hasSessions;

  return (
    <ErrorBoundary>
      <HomeClient
        projects={projects}
        sessions={sessions.slice(0, 3)} // Only show last 3 for recent sessions
        stats={stats}
        isFirstTime={isFirstTime}
        hasProjects={hasProjects}
      />
    </ErrorBoundary>
  );
}
