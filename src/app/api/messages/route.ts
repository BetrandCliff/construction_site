import { NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase";
import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/supabase";

export async function GET() {
  const token = (await cookies()).get("buildvision_session")?.value;
  if (!await isAdminAuthenticated(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(await supabaseRequest("messages", { query: "?select=*&order=created_at.desc" })); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load messages" }, { status: 503 }); }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "A valid JSON object is required" }, { status: 400 }); }
  if (!body || typeof body.name !== "string" || !body.name.trim() || typeof body.email !== "string" || !body.email.includes("@") || typeof body.message !== "string" || !body.message.trim()) {
    return NextResponse.json({ error: "Name, valid email, and message are required" }, { status: 400 });
  }
  try {
    const rows = await supabaseRequest<unknown[]>("messages", { method: "POST", body });
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save message" }, { status: 503 }); }
}
