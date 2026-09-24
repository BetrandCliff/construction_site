import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthenticated, supabaseRequest } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("buildvision_session")?.value;
  if (!await isAdminAuthenticated(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return NextResponse.json({ error: "A valid JSON object is required" }, { status: 400 }); }
  if (!data || typeof data.title !== "string" || !data.title.trim()) return NextResponse.json({ error: "Project title is required" }, { status: 400 });
  const slug = typeof data.slug === "string" && data.slug ? data.slug : data.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  try {
    const rows = await supabaseRequest("projects", { method: "PATCH", query: `?id=eq.${encodeURIComponent(id)}`, body: { title: data.title, slug, data } });
    return NextResponse.json(rows);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update project" }, { status: 503 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("buildvision_session")?.value;
  if (!await isAdminAuthenticated(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try { await supabaseRequest("projects", { method: "DELETE", query: `?id=eq.${encodeURIComponent(id)}` }); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not delete project" }, { status: 503 }); }
}
