import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth-cookie")?.value;

  console.log(`token`, token);

  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (!token) {
    // Not authenticated, redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Avoid infinite loop by excluding /home and static assets
  // if (
  //   pathname === "/home" ||
  //   pathname.startsWith("/_next/") ||
  //   pathname.startsWith("/api/") ||
  //   pathname.includes(".")
  // ) {
  //   return NextResponse.next();
  // }
  //
  // // Redirect all other requests to /home
  // return NextResponse.redirect(new URL("/home", request.url));
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
