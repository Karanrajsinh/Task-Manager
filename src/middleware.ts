

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname, origin } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard"];

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
    "/(api|trpc)(.*)",
  ],
};

