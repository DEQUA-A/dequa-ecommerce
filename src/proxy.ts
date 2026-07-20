import { auth } from "@/lib/auth";
import type { NextProxy } from "next/server";

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};

export const proxy: NextProxy = async (request) => {
  const session = await auth();
  const { pathname, search } = request.nextUrl;

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname + search);

  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "ADMIN") {
      return Response.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/account")) {
    if (!session) {
      return Response.redirect(loginUrl);
    }
  }
}
