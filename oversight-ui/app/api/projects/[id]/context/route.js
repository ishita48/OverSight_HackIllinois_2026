// app/api/projects/[id]/context/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getProjectContext } from "@/utils/db-helpers";

export async function GET(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const projectData = await getProjectContext(id);

    if (!projectData.project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify this project belongs to the user
    if (projectData.project.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract themes from previous sessions
    const themes = [];
    projectData.sessions.forEach((session) => {
      try {
        const feedback =
          typeof session.feedbackJson === "string"
            ? JSON.parse(session.feedbackJson)
            : session.feedbackJson;

        if (feedback.recurringThemes) {
          feedback.recurringThemes.forEach((theme) => {
            themes.push(theme.theme);
          });
        }
      } catch (e) {
        console.error("Error parsing session feedback:", e);
      }
    });

    const uniqueThemes = [...new Set(themes)];

    return NextResponse.json({
      projectName: projectData.project.name,
      projectDescription: projectData.project.description,
      sessionNumber: projectData.sessionCount + 1,
      lastSessionSummary: projectData.project.lastSessionSummary,
      currentStage: projectData.project.currentStage,
      previousThemes: uniqueThemes,
      totalSessions: projectData.sessionCount,
    });
  } catch (error) {
    console.error("Error fetching context:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
