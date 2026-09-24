import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.json({ error: "Supabase Auth is not configured" }, { status: 503 });
  let body: { email?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Email and password are required" }, { status: 400 }); }
  if (!body.email || !body.password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  try {
    const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }), cache: "no-store",
    });
    const result = await response.json() as { access_token?: string; expires_in?: number; user?: { email?: string }; msg?: string; message?: string };
    if (!response.ok || !result.access_token) return NextResponse.json({ error: result.msg ?? result.message ?? "Invalid email or password" }, { status: 401 });
    const allowed = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
    if (allowed?.length && (!result.user?.email || !allowed.includes(result.user.email.toLowerCase()))) {
      return NextResponse.json({ error: "This account is not authorized for administration" }, { status: 403 });
    }
    const out = NextResponse.json({ ok: true });
    out.cookies.set("buildvision_session", result.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: result.expires_in ?? 3600 });
    return out;
  } catch { return NextResponse.json({ error: "Could not reach Supabase Auth" }, { status: 503 }); }
}
