import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isPublicRoute = createRouteMatcher([
  "/",
  "/upload",          // ✅ ADD THIS
  "/upload(.*)",      // ✅ allow nested routes
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/u/(.*)",
  "/api/profile/public(.*)",
  "/api/og-image(.*)",
]);
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
