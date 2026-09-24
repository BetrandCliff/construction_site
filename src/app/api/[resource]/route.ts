import { NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase";

const tables: Record<string, string> = {
  projects: "projects",
  appointments: "appointments",
  messages: "messages",
};

type Context = { params: Promise<{ resource: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { resource } = await params;
  const table = tables[resource];
  if (!table) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try {
    const rows = await supabaseRequest<unknown[]>(table, { query: "?select=*" });
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Database request failed" }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: Context) {
  const { resource } = await params;
  const table = tables[resource];
  if (!table || resource === "projects") {
    return NextResponse.json({ error: "This resource does not accept submissions" }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "A valid JSON body is required" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "A JSON object is required" }, { status: 400 });
  }
  try {
    const rows = await supabaseRequest<unknown[]>(table, { method: "POST", body });
    return NextResponse.json(rows[0] ?? null, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Database request failed" }, { status: 503 });
  }
}
