import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// these are the routes that require authentication
const protectedRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const session = request.cookies.get("session");

  // Determine if the request is for a route that requires authentication
  const requiresAuth = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login page if trying to access a route that requires authentication without a session
  if (requiresAuth && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If there's a session, verify it for routes that require authentication using our API in app/api/login/route.ts
  if (requiresAuth && session) {
    const responseAPI = await fetch(`${origin}/api/login`, {
      headers: {
        Cookie: `session=${session.value}`,
      },
    });

    // Redirect to login page if the session is invalid
    if (responseAPI.status !== 200) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Proceed with the request if it's a public route or if the session is valid for a protected route
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
