import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ── Legacy service URL 301 redirects ─────────────────────────────────────────
const LEGACY_REDIRECTS: Record<string, string> = {
  "/web-design":               "/services/web-design",
  "/local-seo":                "/services/local-seo",
  "/social-media-marketing":   "/services/social-media",
  "/seo":                      "/services/seo",
  "/google-ads":               "/services/google-ads",
  "/ppc":                      "/services/google-ads",
  "/pay-per-click":            "/services/google-ads",
  "/email-marketing":          "/services/email-marketing",
  "/analytics":                "/services/analytics",
  "/web-development":          "/services/web-design",
  "/website-development":      "/services/web-design",
  "/social-media":             "/services/social-media",
  "/social-media-advertising": "/services/social-media",
};

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

function getSecret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? "fallback-secret-change-me");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy service URL → permanent 301 redirect (runs before admin auth)
  const legacyDest = LEGACY_REDIRECTS[pathname];
  if (legacyDest) {
    return NextResponse.redirect(new URL(legacyDest, request.url), { status: 301 });
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Server actions (POST) on the import page handle auth themselves via getSession().
  // Letting middleware buffer the full multipart body causes truncation on large XML files.
  if (pathname === "/admin/migration/import" && request.method === "POST") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("admin-token");
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Legacy service URLs that need 301 redirects
    "/web-design",
    "/local-seo",
    "/social-media-marketing",
    "/seo",
    "/google-ads",
    "/ppc",
    "/pay-per-click",
    "/email-marketing",
    "/analytics",
    "/web-development",
    "/website-development",
    "/social-media",
    "/social-media-advertising",
  ],
};
