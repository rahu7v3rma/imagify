import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /dashboard
  if (pathname.startsWith("/dashboard")) {
    const userIdCookie = request.cookies.get("imagify.user.id");

    // If no user ID cookie, redirect to login
    if (!userIdCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
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
