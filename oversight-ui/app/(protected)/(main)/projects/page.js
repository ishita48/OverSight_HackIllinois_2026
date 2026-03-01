import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Projects - OverSight",
  description: "Manage your storytelling projects and narrative arcs",
};

export default async function ProjectsPage() {
  const userExist = await onAuthenticateUser();
  if (!userExist.user) {
    redirect("/sign-in");
  }

  return <ProjectsClient user={userExist.user} />;
}
