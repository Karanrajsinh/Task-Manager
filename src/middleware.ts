import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname, origin } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard"];

  // Exclude /api/webhook from authentication checks
  if (pathname.startsWith("/api/webhook")) {
    return NextResponse.next(); // Allow webhook route to run without authentication
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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(?!/webhook)(.*)", // Exclude /api/webhook
  ],
};
