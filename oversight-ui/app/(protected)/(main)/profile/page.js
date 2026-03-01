import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Your Founder Profile | OverSight",
  description:
    "Your complete founder journey - who you are, why you build, how you've grown",
};

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <ProfileClient />;
}
