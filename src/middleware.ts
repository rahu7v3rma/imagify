import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ENV } from "./constants/common";

let lastRequest = 0;

export async function middleware(request: NextRequest) {
  const appEnv = process.env.APP_ENV;

  if (appEnv === APP_ENV.PRODUCTION) {
    const now = Date.now();

    if (now - lastRequest < 100) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    lastRequest = now;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};
