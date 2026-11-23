import { NextResponse } from "next/server";

const redirectTo = (request, path, saveCallback = false) => {
  const url = new URL(path, request.url);

  if (saveCallback) {
    url.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search
    );
  }

  return NextResponse.redirect(url);
};

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const cookie = request.headers.get("cookie");

  if (!cookie) {
    return redirectTo(request, "/sign-in", true);
  }

  try {
    const res = await fetch(
      new URL("/api/auth/get-session", request.url),
      {
        headers: {
          cookie,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return redirectTo(request, "/sign-in", true);
    }

    const data = await res.json();
    const user = data?.user || data?.data?.user;

    if (!user) {
      return redirectTo(request, "/sign-in", true);
    }

    const role = String(user.role || "customer")
      .trim()
      .toLowerCase();

    if (
      pathname.startsWith("/dashboard/admin") &&
      role !== "admin"
    ) {
      return redirectTo(request, "/unauthorized");
    }

    if (
      pathname.startsWith("/dashboard/vendor") &&
      role !== "vendor"
    ) {
      return redirectTo(request, "/unauthorized");
    }

    if (
      pathname.startsWith("/dashboard/customer") &&
      role !== "customer" &&
      role !== "admin"
    ) {
      return redirectTo(request, "/unauthorized");
    }

    return NextResponse.next();
  } catch {
    return redirectTo(request, "/sign-in", true);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};