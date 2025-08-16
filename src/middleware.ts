import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ENV } from "@/constants/common";
import { getAccessTokenServer } from "@/utils/cookies-server";

let lastRequest = 0;

export async function middleware(request: NextRequest) {
  const appEnv = process.env.APP_ENV;
  const { pathname } = request.nextUrl;

  if (appEnv === APP_ENV.PRODUCTION) {
    if (pathname.startsWith("/dashboard")) {
      const now = Date.now();
      if (now - lastRequest < 100) {
        return new NextResponse("Rate limit exceeded", { status: 429 });
      }
      lastRequest = now;

      const accessToken = await getAccessTokenServer();
      if (!accessToken) {
        return NextResponse.redirect("/login");
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};
