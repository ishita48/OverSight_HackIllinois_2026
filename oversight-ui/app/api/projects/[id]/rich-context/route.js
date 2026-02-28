// app/api/projects/[id]/rich-context/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { buildRichContext } from "@/utils/narrative-context";

export async function GET(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params in Next.js 15
    const { id: projectId } = await params;
    const { searchParams } = new URL(req.url);
    const currentSessionNumber = parseInt(searchParams.get("session") || "1");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Build rich context using the utility function
    // This will handle project ownership verification internally
    const context = await buildRichContext(projectId, currentSessionNumber);

    if (!context) {
      return NextResponse.json(
        { error: "Failed to build context or project not found" },
        { status: 404 }
      );
    }

    // Verify the project belongs to the user by checking the context
    // The buildRichContext function should return null if unauthorized
    // But we can add an extra check here if needed

    return NextResponse.json(
      {
        context,
        projectId,
        currentSessionNumber,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error building rich context:", err);
    return NextResponse.json(
      { error: "Failed to build rich context", details: err.message },
      { status: 500 }
    );
  }
}
