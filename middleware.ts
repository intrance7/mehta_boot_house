import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Secret URL token — reads from environment variable.
// Access via: /admin?key=<your_key>
// Without the correct key, visitors get a fake 404 page.
const ADMIN_URL_KEY = process.env.ADMIN_URL_KEY || "mehta1987";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const urlKey = searchParams.get("key");

    // Only allow access if the correct URL key is provided
    if (urlKey === ADMIN_URL_KEY) {
      return NextResponse.next();
    }

    // Block access — return a fake 404 page so attackers think the page doesn't exist
    return new NextResponse(
      `<!DOCTYPE html><html><head><title>404: This page could not be found</title><style>body{color:#000;background:#fff;margin:0;font-family:system-ui,sans-serif}main{display:flex;align-items:center;justify-content:center;min-height:100vh}h1{font-size:24px;font-weight:500;margin-right:20px;padding-right:23px;border-right:1px solid rgba(0,0,0,.3)}p{font-size:14px}</style></head><body><main><h1>404</h1><p>This page could not be found.</p></main></body></html>`,
      {
        status: 404,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
