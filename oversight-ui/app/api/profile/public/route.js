// app/api/profile/public/route.js
import { NextResponse } from "next/server";
import { getPublicProfileSnapshot } from "@/utils/profileSnapshotManager";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const publicProfile = await getPublicProfileSnapshot(userId);

    if (!publicProfile) {
      return NextResponse.json(
        { error: "Public profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(publicProfile);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch public profile", details: error.message },
      { status: 500 }
    );
  }
}
