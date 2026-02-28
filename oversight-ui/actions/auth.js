// actions/auth.js
"use server";
import { db } from "@/utils/db";
import { userProfiles } from "@/utils/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function onAuthenticateUser() {
  try {
    console.log("🔄 Starting onAuthenticateUser...");

    const user = await currentUser();
    if (!user) {
      console.log("❌ No authenticated user found");
      return { status: 403, error: "No user found" };
    }

    console.log(
      "✅ User found:",
      user.id,
      user.emailAddresses?.[0]?.emailAddress
    );

    // Check if user already exists
    const existing = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.clerkUserId, user.id));

    if (existing.length > 0) {
      console.log("✅ Existing user found in database");
      return { status: 200, user: existing[0] };
    }

    console.log("➕ Creating new user profile");

    const userData = {
      clerkUserId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress ?? "",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User",
      imageUrl: user.imageUrl ?? "",
      createdAt: new Date(),
      plan: "free",
      isActive: true,
      hasOnboarded: false,
      interviewCredits: 3,
    };

    console.log("📝 User data to insert:", userData);

    const newUser = await db.insert(userProfiles).values(userData).returning();

    if (newUser.length > 0) {
      console.log("✅ New user created successfully:", newUser[0]);
      return { status: 201, user: newUser[0] };
    }

    console.log("❌ Failed to create user - no data returned");
    return { status: 400, error: "Failed to create user" };
  } catch (error) {
    console.error("🔴 ERROR in onAuthenticateUser:", error);
    console.error("🔴 Error stack:", error.stack);
    return { status: 500, error: error.message };
  }
}
