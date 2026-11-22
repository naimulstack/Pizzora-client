import { NextResponse } from "next/server";

const toUrl = (request, path, saveCallback = false) => {
  const url = new URL(path, request.url);
  if (saveCallback) url.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(url);
};

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const cookie = request.headers.get("cookie");

  if (!cookie) return toUrl(request, "/sign-in", true);

  const res = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);

  const data = res?.ok ? await res.json().catch(() => null) : null;
  const user = data?.user || data?.data?.user;

  if (!user) return toUrl(request, "/sign-in", true);

  const role = String(user.role || "customer").trim().toLowerCase();

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return toUrl(request, "/unauthorized");
  }

  if (pathname.startsWith("/dashboard/vendor") && role !== "vendor") {
    return toUrl(request, "/unauthorized");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
