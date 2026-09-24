import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthenticated } from "@/lib/supabase";

const mediaTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream",
  "application/pdf",
]);

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

  let input: {
    filename?: string;
    contentType?: string;
    size?: number;
    kind?: string;
  };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Upload details are required" },
      { status: 400 },
    );
  }
  const { filename, contentType, size, kind } = input;
  const ext = filename?.split(".").pop()?.toLowerCase();
  const accepted =
    !!contentType &&
    mediaTypes.has(contentType) &&
    ((contentType.startsWith("image/") && ext !== "svg") ||
      (ext === "pdf" && contentType === "application/pdf") ||
      ((ext === "glb" || ext === "gltf") &&
        [
          "model/gltf-binary",
          "model/gltf+json",
          "application/octet-stream",
        ].includes(contentType)));
  if (
    !filename ||
    !accepted ||
    typeof size !== "number" ||
    size <= 0 ||
    size > 100 * 1024 * 1024 ||
    !["projects", "designs", "site"].includes(kind ?? "")
  ) {
    return NextResponse.json(
      {
        error:
          "Choose a supported image, PDF or GLB/GLTF model file under 100 MB",
      },
      { status: 400 },
    );
  }

  try {
    const client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const safeName = filename
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${kind}/${crypto.randomUUID()}-${safeName}`;
    const bucket = process.env.SUPABASE_MEDIA_BUCKET || "projects";
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUploadUrl(path);
    if (error) throw error;
    const { data: publicAsset } = client.storage
      .from(bucket)
      .getPublicUrl(path);
    return NextResponse.json({
      bucket,
      path,
      token: data.token,
      publicUrl: publicAsset.publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not prepare the upload",
      },
      { status: 503 },
    );
  }
}
