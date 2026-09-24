import { NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase";
import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/supabase";

type ProjectRow = { id: string; slug: string; title: string; data: Record<string, unknown> };

export async function GET() {
  try {
    const rows = await supabaseRequest<ProjectRow[]>("projects", { query: "?select=*&order=created_at.desc" });
    return NextResponse.json(rows.map(({ data, ...row }) => ({ ...data, ...row })));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load projects" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("buildvision_session")?.value;
  if (!await isAdminAuthenticated(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return NextResponse.json({ error: "A valid JSON object is required" }, { status: 400 }); }
  if (!data || typeof data !== "object" || Array.isArray(data) || typeof data.title !== "string" || !data.title.trim()) {
    return NextResponse.json({ error: "Project title is required" }, { status: 400 });
  }
  const slug = typeof data.slug === "string" && data.slug ? data.slug : data.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  try {
    const rows = await supabaseRequest<ProjectRow[]>("projects", { method: "POST", body: { slug, title: data.title, data } });
    const row = rows[0];
    return NextResponse.json({ ...row.data, id: row.id, slug: row.slug, title: row.title }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save project" }, { status: 503 });
  }
}
