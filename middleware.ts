import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/generate", "/history"];
const authRoutes = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const user = token ? verifyToken(token) : null;

  // Redirect authenticated users away from auth pages
  if (user && authRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users to login
  if (!user && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/generate/:path*", "/history/:path*", "/login", "/signup"],
};
