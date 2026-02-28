import Sidebar from "@/components/ui/ReusableComponents/sidebar";
import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function layout({ children }) {
  const userExist = await onAuthenticateUser();
  if (!userExist.user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex">
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-20">
        {/* Content wrapper with proper spacing */}
        <div className="min-h-screen">
          <div className="h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
