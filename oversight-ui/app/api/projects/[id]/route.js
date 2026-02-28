// app/api/projects/[id]/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { founderProjects, founderNarratives } from "@/utils/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get project
    const [project] = await db
      .select()
      .from(founderProjects)
      .where(
        and(eq(founderProjects.id, id), eq(founderProjects.userId, user.id))
      );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get all sessions for this project
    const sessions = await db
      .select()
      .from(founderNarratives)
      .where(eq(founderNarratives.projectId, id))
      .orderBy(desc(founderNarratives.createdAt));

    return NextResponse.json({
      project,
      sessions,
      sessionCount: sessions.length,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify project belongs to user
    const [project] = await db
      .select()
      .from(founderProjects)
      .where(
        and(eq(founderProjects.id, id), eq(founderProjects.userId, user.id))
      );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete all sessions for this project first
    await db
      .delete(founderNarratives)
      .where(eq(founderNarratives.projectId, id));

    // Delete the project
    await db.delete(founderProjects).where(eq(founderProjects.id, id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
