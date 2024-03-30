import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AdminDb,
  getRestaurantById,
} from "./lib/firebase/firebase-admin-config";

// List of routes that require authentication
const requiresAuthRoutes = ["/admin", "/dashboard"];

// Firebase authentication initiation and callback routes
const firebaseAuthRoutes = ["/auth/start", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const session = request.cookies.get("session");

  // Allow Firebase auth routes
  if (firebaseAuthRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Determine if the request is for a route that requires authentication
  const requiresAuth = requiresAuthRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login page if trying to access a route that requires authentication without a session
  if (requiresAuth && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If there's a session, optionally verify it for routes that require authentication
  if (requiresAuth && session) {
    const responseAPI = await fetch(`${origin}/api/login`, {
      headers: {
        Cookie: `session=${session.value}`,
      },
    });

    const result: { isLogged: boolean } & {
      user: User & {
        role: "admin" | "user";
      };
    } = await responseAPI.json();

    // Redirect to login page if session is not valid
    if (responseAPI.status !== 200) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      result.user.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/dashboard/")) {
      const restaurantId = pathname.split("/")[2];
      const responseAPI = await fetch(
        `${origin}/api/dashboard/check?restaurantId=${restaurantId}`,
        {
          headers: {
            Cookie: `session=${session.value}`,
          },
        }
      );

      const res = (await responseAPI.json()) as { access: boolean };

      if (res.access) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Proceed with the request if it's a public route or if the session is valid for a protected route
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};