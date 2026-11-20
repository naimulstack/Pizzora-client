import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isVendorRoute = pathname.startsWith("/dashboard/vendor");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!isDashboardRoute) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") || "";

  const sessionRes = await fetch(
    new URL("/api/auth/get-session", request.url),
    {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    }
  ).catch(() => null);

  if (!sessionRes || !sessionRes.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const sessionData = await sessionRes.json().catch(() => null);
  const user = sessionData?.user || sessionData?.data?.user || null;

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = String(user.role || "customer").toLowerCase();

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isVendorRoute && role !== "vendor") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};