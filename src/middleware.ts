import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  //
  const token = request.cookies.get("auth-cookie")?.value;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  console.log(token);

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
