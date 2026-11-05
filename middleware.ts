import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection at the edge.
 *
 * Demo mode uses two lightweight cookies so this file can block dashboard and
 * admin routes even before React loads:
 *   gx_session → any signed-in buyer/seller
 *   gx_admin   → admin console
 *
 * The cookies contain no personal data. In production Supabase Auth issues
 * signed, httpOnly cookies, and `getUser()` is verified again inside every
 * server component — middleware is a convenience layer, not the only guard.
 * The database adds Row Level Security as the final enforcement point.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasUserSession = request.cookies.get("gx_session")?.value === "1";
  const hasAdminSession = request.cookies.get("gx_admin")?.value === "1";

  let response: NextResponse;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      response = NextResponse.redirect(url);
    } else {
      response = NextResponse.next();
    }
  } else if (pathname.startsWith("/dashboard") && !hasUserSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self)",
  );
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
