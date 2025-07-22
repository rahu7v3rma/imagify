import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const ratelimit = redis 
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(60, "60 s"),
    })
  : null;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /dashboard
  if (pathname.startsWith("/dashboard")) {
    const userIdCookie = request.cookies.get("imagify.user.id");

    // If no user ID cookie, redirect to login
    if (!userIdCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Apply rate limiting only if Redis is configured
    if (ratelimit) {
      const identifier = "imagify";
      const rateLimitResponse = await ratelimit.limit(identifier);

      if (!rateLimitResponse.success) {
        return new NextResponse("Rate limit exceeded", {
          status: 429,
        });
      }
    }
  }

  // Check if the path starts with /admin (but not /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const userIdCookie = request.cookies.get("imagify.user.id");
    const userRoleCookie = request.cookies.get("imagify.user.role.name");

    // If no user ID cookie or user role is not admin, redirect to admin login
    if (!userIdCookie || userRoleCookie?.value !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
