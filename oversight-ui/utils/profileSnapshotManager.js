// utils/profileSnapshotManager.js
import { db } from "./db.js";
import { profileSnapshots } from "./schema.js";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";

/**
 * Generates a hash from profile data to detect changes
 */
function generateDataHash(profileData) {
  const dataString = JSON.stringify(
    profileData,
    Object.keys(profileData).sort()
  );
  return crypto.createHash("sha256").update(dataString).digest("hex");
}

/**
 * Saves or updates a profile snapshot
 * Maintains only "latest" and "previous" snapshots for each user
 */
export async function saveProfileSnapshot(userId, profileData) {
  try {
    const dataHash = generateDataHash(profileData);

    // Check if current data is different from latest snapshot
    const existingLatest = await db
      .select()
      .from(profileSnapshots)
      .where(
        and(
          eq(profileSnapshots.userId, userId),
          eq(profileSnapshots.snapshotType, "latest")
        )
      )
      .limit(1);

    // If data hasn't changed, don't create a new snapshot
    if (existingLatest.length > 0 && existingLatest[0].dataHash === dataHash) {
      console.log("Profile data unchanged, skipping snapshot");
      return existingLatest[0];
    }

    // If we have an existing "latest", move it to "previous"
    if (existingLatest.length > 0) {
      // Delete any existing "previous" snapshot
      await db
        .delete(profileSnapshots)
        .where(
          and(
            eq(profileSnapshots.userId, userId),
            eq(profileSnapshots.snapshotType, "previous")
          )
        );

      // Move current "latest" to "previous"
      await db
        .update(profileSnapshots)
        .set({
          snapshotType: "previous",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(profileSnapshots.userId, userId),
            eq(profileSnapshots.snapshotType, "latest")
          )
        );
    }

    // Create new "latest" snapshot
    const newSnapshot = await db
      .insert(profileSnapshots)
      .values({
        userId,
        snapshotType: "latest",
        profileData,
        totalSessions: profileData.metadata?.totalSessions || 0,
        totalProjects: profileData.metadata?.totalProjects || 0,
        headlineTruth: profileData.headlineTruth || null,
        founderType: profileData.founderType || null,
        dataHash,
        generatedAt: new Date(),
      })
      .returning();

    console.log(`Profile snapshot saved for user ${userId}`);
    return newSnapshot[0];
  } catch (error) {
    console.error("Error saving profile snapshot:", error);
    throw error;
  }
}

/**
 * Gets the latest profile snapshot for a user
 */
export async function getLatestProfileSnapshot(userId) {
  try {
    const snapshot = await db
      .select()
      .from(profileSnapshots)
      .where(
        and(
          eq(profileSnapshots.userId, userId),
          eq(profileSnapshots.snapshotType, "latest")
        )
      )
      .limit(1);

    return snapshot.length > 0 ? snapshot[0] : null;
  } catch (error) {
    console.error("Error getting latest profile snapshot:", error);
    throw error;
  }
}

/**
 * Gets both latest and previous profile snapshots for comparison
 */
export async function getProfileSnapshots(userId) {
  try {
    const snapshots = await db
      .select()
      .from(profileSnapshots)
      .where(eq(profileSnapshots.userId, userId))
      .orderBy(desc(profileSnapshots.createdAt));

    const latest = snapshots.find((s) => s.snapshotType === "latest");
    const previous = snapshots.find((s) => s.snapshotType === "previous");

    return { latest, previous };
  } catch (error) {
    console.error("Error getting profile snapshots:", error);
    throw error;
  }
}

/**
 * Gets profile snapshot data suitable for public display
 */
export async function getPublicProfileSnapshot(userId) {
  try {
    const snapshot = await getLatestProfileSnapshot(userId);

    if (!snapshot) {
      return null;
    }

    // Return only safe, public-appropriate data
    return {
      ...snapshot.profileData,
      // Remove or sanitize sensitive information
      metadata: {
        ...snapshot.profileData.metadata,
        // Keep general stats but remove detailed session info
        totalSessions: snapshot.totalSessions,
        totalProjects: snapshot.totalProjects,
        dateRange: snapshot.profileData.metadata?.dateRange,
        projects: snapshot.profileData.metadata?.projects?.map((project) => ({
          id: project.id,
          title: project.title,
          stage: project.stage,
          sessionCount: project.sessionCount,
          // Remove detailed session data for public view
        })),
      },
      generatedAt: snapshot.generatedAt,
    };
  } catch (error) {
    console.error("Error getting public profile snapshot:", error);
    throw error;
  }
}

/**
 * Cleanup old snapshots (optional maintenance function)
 */
export async function cleanupOldSnapshots(userId, keepCount = 2) {
  try {
    const allSnapshots = await db
      .select()
      .from(profileSnapshots)
      .where(eq(profileSnapshots.userId, userId))
      .orderBy(desc(profileSnapshots.createdAt));

    if (allSnapshots.length > keepCount) {
      const toDelete = allSnapshots.slice(keepCount);

      for (const snapshot of toDelete) {
        await db
          .delete(profileSnapshots)
          .where(eq(profileSnapshots.id, snapshot.id));
      }

      console.log(
        `Cleaned up ${toDelete.length} old snapshots for user ${userId}`
      );
    }
  } catch (error) {
    console.error("Error cleaning up old snapshots:", error);
  }
}
