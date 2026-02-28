// utils/publicProfileHelper.js
import { db } from "./db.js";
import { userProfiles } from "./schema.js";
import { eq } from "drizzle-orm";

/**
 * Generates a safe username from user data
 */
export function generateUsername(firstName, lastName, clerkUserId) {
  const baseName = `${firstName || ""}${lastName || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const fallback = clerkUserId.slice(-8); // Last 8 chars of clerk ID
  return baseName || fallback;
}

/**
 * Ensures user has a username for public profile
 */
export async function ensureUserUsername(clerkUserId, firstName, lastName) {
  try {
    // Check if user already has a username
    const existingUser = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.clerkUserId, clerkUserId))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].username) {
      return existingUser[0].username;
    }

    // Generate a unique username
    const baseUsername = generateUsername(firstName, lastName, clerkUserId);
    let username = baseUsername;
    let counter = 1;

    // Check for uniqueness and increment if needed
    while (true) {
      const existing = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.username, username))
        .limit(1);

      if (existing.length === 0) {
        break;
      }

      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Update or create user profile with username
    if (existingUser.length > 0) {
      await db
        .update(userProfiles)
        .set({
          username,
          name: `${firstName || ""} ${lastName || ""}`.trim() || null,
        })
        .where(eq(userProfiles.clerkUserId, clerkUserId));
    } else {
      await db.insert(userProfiles).values({
        clerkUserId,
        username,
        name: `${firstName || ""} ${lastName || ""}`.trim() || null,
      });
    }

    return username;
  } catch (error) {
    console.error("Error ensuring username:", error);
    throw error;
  }
}

/**
 * Gets user's public profile URL
 */
export async function getUserPublicProfileUrl(
  clerkUserId,
  firstName,
  lastName
) {
  try {
    const username = await ensureUserUsername(clerkUserId, firstName, lastName);
    return `/u/${username}`;
  } catch (error) {
    console.error("Error getting public profile URL:", error);
    return null;
  }
}
