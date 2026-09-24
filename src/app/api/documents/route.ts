import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthenticated, supabaseRequest } from "@/lib/supabase";
export async function GET() {
  const token = (await cookies()).get("buildvision_session")?.value;
  if (!(await isAdminAuthenticated(token)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  try {
    const docs = await supabaseRequest<{ file_url: string }[]>("documents", {
      query: "?select=*&order=created_at.desc",
    });
    const signed = await Promise.all(
      docs.map(async (doc) => {
        const response = await fetch(
          `${url}/storage/v1/object/sign/${process.env.SUPABASE_STORAGE_BUCKET || "documents"}/${encodeURIComponent(doc.file_url)}`,
          {
            method: "POST",
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ expiresIn: 3600 }),
            cache: "no-store",
          },
        );
        if (!response.ok) return doc;
        const result = (await response.json()) as { signedURL?: string };
        return {
          ...doc,
          file_url: result.signedURL?.startsWith("http")
            ? result.signedURL
            : `${url}/storage/v1${result.signedURL ?? ""}`,
        };
      }),
    );
    return NextResponse.json(signed);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load documents",
      },
      { status: 503 },
    );
  }
}
export async function POST(request: Request) {
  const token = (await cookies()).get("buildvision_session")?.value;
  if (!(await isAdminAuthenticated(token)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey)
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size)
      return NextResponse.json(
        { error: "Choose a file to upload" },
        { status: 400 },
      );
    if (file.size > 15 * 1024 * 1024)
      return NextResponse.json(
        { error: "Files must be 15 MB or smaller" },
        { status: 413 },
      );
    const name = String(form.get("name") || file.name).trim();
    const category = String(form.get("category") || "Project document");
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "documents";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const objectName = `${Date.now()}-${safeName}`;
    const upload = await fetch(
      `${url}/storage/v1/object/${bucket}/${encodeURIComponent(objectName)}`,
      {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: await file.arrayBuffer(),
        cache: "no-store",
      },
    );
    if (!upload.ok) {
      const detail = await upload.text();
      throw new Error(`Storage upload failed (${upload.status}): ${detail}`);
    }
    const rows = await supabaseRequest<unknown[]>("documents", {
      method: "POST",
      body: {
        name,
        category,
        file_url: objectName,
        file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      },
    });
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not upload document",
      },
      { status: 503 },
    );
  }
}
