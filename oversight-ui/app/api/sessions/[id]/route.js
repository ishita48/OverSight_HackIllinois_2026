import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { founderNarratives } from "@/utils/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // First, check if the session exists and belongs to the user
    const existingSession = await db
      .select()
      .from(founderNarratives)
      .where(
        and(
          eq(founderNarratives.sessionId, id),
          eq(founderNarratives.userId, user.id)
        )
      )
      .limit(1);

    if (!existingSession || existingSession.length === 0) {
      return NextResponse.json(
        {
          error: "Session not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    // Delete the session
    await db
      .delete(founderNarratives)
      .where(
        and(
          eq(founderNarratives.sessionId, id),
          eq(founderNarratives.userId, user.id)
        )
      );

    return NextResponse.json(
      { message: "Session deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
