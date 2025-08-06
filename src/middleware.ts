import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "./constants/routes";

const ALLOWED_PATHS = [
  ROUTES.HOME,
  ROUTES.BLOG,
  ROUTES.PRICING,
  ROUTES.CONTACT,
  ROUTES.TERMS_OF_SERVICE,
  ROUTES.PRIVACY_POLICY,
];

let lastRequest = 0;

export async function middleware(request: NextRequest) {
  if (!ALLOWED_PATHS.includes(request.nextUrl.pathname)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const now = Date.now();

  if (now - lastRequest < 100) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  lastRequest = now;
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};
