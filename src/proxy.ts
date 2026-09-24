import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (["/admin/login", "/admin/forgot-password"].includes(pathname)) return NextResponse.next();
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const token = request.cookies.get("buildvision_session")?.value;
  if (url && anonKey && token) {
    try {
      const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: `Bearer ${token}` }, cache: "no-store" });
      const user = response.ok ? await response.json() as { email?: string } : null;
      const allowed = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
      if (user && (!allowed?.length || (!!user.email && allowed.includes(user.email.toLowerCase())))) return NextResponse.next();
    } catch { /* redirect to sign in when Supabase cannot validate the session */ }
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = { matcher: ["/admin/:path*"] };
