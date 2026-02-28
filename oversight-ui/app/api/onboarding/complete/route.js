import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { userProfiles, founderProjects } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { completedIntro, selectedIntent } = body;

    // Mark user as onboarded after completing the intro experience
    await db
      .update(userProfiles)
      .set({ hasOnboarded: true })
      .where(eq(userProfiles.clerkUserId, userId));

    return NextResponse.json({
      success: true,
      message: "Onboarding experience completed successfully",
      selectedIntent,
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
