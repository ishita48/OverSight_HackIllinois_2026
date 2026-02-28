// app/api/profile/snapshots/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getProfileSnapshots } from "@/utils/profileSnapshotManager";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snapshots = await getProfileSnapshots(userId);

    if (!snapshots.latest) {
      return NextResponse.json(
        { error: "No profile snapshots found" },
        { status: 404 }
      );
    }

    // Calculate changes between latest and previous if both exist
    let changes = null;
    if (snapshots.previous) {
      const latest = snapshots.latest.profileData;
      const previous = snapshots.previous.profileData;

      changes = {
        sessionsAdded:
          (latest.metadata?.totalSessions || 0) -
          (previous.metadata?.totalSessions || 0),
        projectsAdded:
          (latest.metadata?.totalProjects || 0) -
          (previous.metadata?.totalProjects || 0),
        truthChanged: latest.headlineTruth !== previous.headlineTruth,
        founderTypeChanged: latest.founderType !== previous.founderType,
        timeBetween:
          new Date(snapshots.latest.createdAt) -
          new Date(snapshots.previous.createdAt),
      };
    }

    return NextResponse.json({
      latest: snapshots.latest,
      previous: snapshots.previous,
      changes,
      hasComparison: !!snapshots.previous,
    });
  } catch (error) {
    console.error("Error fetching profile snapshots:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile snapshots", details: error.message },
      { status: 500 }
    );
  }
}
