import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname, origin } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard"];

  // Allow public access to the webhook route
  if (pathname.startsWith("/api/webhook")) {
    return NextResponse.next();
  }

  // Check if the user is authenticated
  const authObject = await auth();
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !authObject.userId) {
    return NextResponse.redirect(`${origin}/login`);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!_next|_static|.*\\..*).*)", // Matches all routes except Next.js internals and static assets
    "/api/:path*", // Matches all API routes (but we explicitly handle /api/webhook inside the function)
  ],
};
