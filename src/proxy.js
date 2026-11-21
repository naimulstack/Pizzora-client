import { NextResponse } from "next/server";

const LOGIN_PATH = "/login";
const UNAUTHORIZED_PATH = "/unauthorized";

const redirectTo = (request, path, withCallback = false) => {
  const url = new URL(path, request.url);
  if (withCallback) {
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
  }
  return NextResponse.redirect(url);
};

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie");
  if (!cookie) {
    return redirectTo(request, LOGIN_PATH, true);
  }

  const res = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);

  if (!res?.ok) {
    return redirectTo(request, LOGIN_PATH, true);
  }

  const data = await res.json().catch(() => null);
  const user = data?.user || data?.data?.user;

  if (!user) {
    return redirectTo(request, LOGIN_PATH, true);
  }

  const role = String(user.role || "customer").trim().toLowerCase();

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return redirectTo(request, UNAUTHORIZED_PATH);
  }

  if (pathname.startsWith("/dashboard/vendor") && role !== "vendor") {
    return redirectTo(request, UNAUTHORIZED_PATH);
  }

  const isCustomerSubRoute =
    pathname.startsWith("/dashboard/customer") ||
    pathname.startsWith("/dashboard/profile");

  if (isCustomerSubRoute && role !== "customer") {
    return redirectTo(request, UNAUTHORIZED_PATH);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};