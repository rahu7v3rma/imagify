import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

let lastRequest = 0;

export async function middleware(request: NextRequest) {
  const now = Date.now();

  if (now - lastRequest < 1000) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  lastRequest = now;
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};
