const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function supabaseRequest<T>(table: string, options: {
  method?: "GET" | "POST";
  query?: string;
  body?: unknown;
} = {}): Promise<T> {
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}${options.query ?? ""}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${detail}`);
  }
  return response.json() as Promise<T>;
}
