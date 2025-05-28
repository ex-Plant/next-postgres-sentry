import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  //
  const token = request.cookies.get("auth-cookie")?.value;

  // Avoid infinite loop by excluding /home and static assets
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/home" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    console.log("🚧 !token in req  - redirecting to login ");

    // Not authenticated, redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/") {
    const ticketsPath = new URL("/tickets", request.url);
    console.log("🚧 redirecting from home to: " + ticketsPath);

    return NextResponse.redirect(ticketsPath);
  }
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
