import { onAuthenticateUser } from "../../../actions/auth";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { userProfiles } from "@/utils/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AuthCallbackPage() {
  console.log("🔄 Callback page started");

  // Check environment variables first
  const hasClerkPublishableKey =
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasClerkSecretKey = !!process.env.CLERK_SECRET_KEY;

  if (!hasClerkPublishableKey || !hasClerkSecretKey) {
    console.log("❌ Missing Clerk environment variables");
    console.log(
      "- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:",
      hasClerkPublishableKey ? "✅" : "❌"
    );
    console.log("- CLERK_SECRET_KEY:", hasClerkSecretKey ? "✅" : "❌");
    redirect("/test-auth");
  }

  // Check if user is authenticated with Clerk
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    console.log("❌ No userId in callback, redirecting to sign-in");
    redirect("/sign-in");
  }

  console.log("✅ User authenticated with Clerk:", userId);

  // Process user authentication and profile creation
  try {
    console.log("🔄 Calling onAuthenticateUser...");
    const authResult = await onAuthenticateUser();
    console.log("📊 Auth result:", authResult);

    if (authResult.status === 200 || authResult.status === 201) {
      console.log("✅ User profile processed successfully");

      // Check if user has completed onboarding
      const userProfile = await db
        .select({ hasOnboarded: userProfiles.hasOnboarded })
        .from(userProfiles)
        .where(eq(userProfiles.clerkUserId, userId))
        .limit(1);

      if (userProfile.length > 0 && !userProfile[0].hasOnboarded) {
        console.log("🎭 User needs onboarding, redirecting to onboarding");
        redirect("/onboarding");
      }
    } else {
      console.log(
        "⚠️ Profile processing failed but user is authenticated, proceeding to home"
      );
    }
  } catch (error) {
    console.error("❌ Error in callback:", error);
    console.log(
      "⚠️ Error occurred but user is authenticated, proceeding to home"
    );
  }

  // Always redirect to home if we get here (user is authenticated and onboarded)
  console.log("🏠 Redirecting to home page");
  redirect("/home");
}
