// utils/db-helpers.js (create new file)
import { db } from "./db";
import { founderProjects, founderNarratives } from "./schema";
import { eq, desc, and } from "drizzle-orm";

export async function getUserProjects(userId) {
  return await db
    .select()
    .from(founderProjects)
    .where(eq(founderProjects.userId, userId))
    .orderBy(desc(founderProjects.updatedAt));
}

export async function getProjectContext(projectId) {
  const [project] = await db
    .select()
    .from(founderProjects)
    .where(eq(founderProjects.id, projectId));

  const sessions = await db
    .select()
    .from(founderNarratives)
    .where(eq(founderNarratives.projectId, projectId))
    .orderBy(desc(founderNarratives.createdAt));

  return {
    project,
    sessions,
    sessionCount: sessions.length,
    lastSession: sessions[0] || null,
  };
}

export async function createProject(data) {
  const [project] = await db.insert(founderProjects).values(data).returning();
  return project;
}

export async function updateProject(projectId, data) {
  const [updated] = await db
    .update(founderProjects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(founderProjects.id, projectId))
    .returning();
  return updated;
}
