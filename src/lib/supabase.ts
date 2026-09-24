import "server-only";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

export async function isAdminAuthenticated(token?: string) {
  if (!token || !supabaseUrl || !anonKey) return false;
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return false;
    const user = await response.json() as { email?: string };
    const allowed = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
    return !allowed?.length || (!!user.email && allowed.includes(user.email.toLowerCase()));
  } catch { return false; }
}

export async function supabaseRequest<T>(table: string, options: {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: string;
  body?: unknown;
  prefer?: string;
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
      Prefer: options.prefer ?? "return=representation",
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${detail}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
