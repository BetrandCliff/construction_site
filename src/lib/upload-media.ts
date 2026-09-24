import { createClient } from "@supabase/supabase-js";

let storageClient: ReturnType<typeof createClient> | undefined;
function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_ANON_KEY in .env, then restart the dev server.");
  storageClient ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return storageClient;
}

export async function uploadMedia(file: File, kind: "projects" | "designs" | "site") {
  const response = await fetch("/api/uploads/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream", size: file.size, kind }),
  });
  const signed = await response.json();
  if (!response.ok) throw new Error(signed.error ?? "Could not prepare the file upload");

  const { error } = await getStorageClient().storage.from(signed.bucket).uploadToSignedUrl(
    signed.path,
    signed.token,
    file,
    { contentType: file.type || "application/octet-stream" },
  );
  if (error) throw new Error(error.message);
  return signed.publicUrl as string;
}

export async function uploadMediaFiles(files: FileList | File[], kind: "projects" | "designs" | "site") {
  const urls: string[] = [];
  for (const file of Array.from(files)) urls.push(await uploadMedia(file, kind));
  return urls;
}
