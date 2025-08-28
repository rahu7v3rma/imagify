import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ENV } from "@/constants/common";
import { getAccessTokenServer } from "@/utils/cookies-server";

export async function middleware(request: NextRequest) {
  const appEnv = process.env.APP_ENV;
  const { pathname } = request.nextUrl;

  if (appEnv === APP_ENV.PRODUCTION) {
    if (pathname.startsWith("/dashboard")) {
      const accessToken = await getAccessTokenServer();
      if (!accessToken) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};
