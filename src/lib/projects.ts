import { designs as seedDesigns, projects as seedProjects, type Design, type Project } from "@/lib/data";
import { supabaseRequest } from "@/lib/supabase";

type ProjectRow = { id: string; slug: string; title: string; data: Record<string, unknown> };

export async function getProjects(): Promise<Project[]> {
  try {
    const rows = await supabaseRequest<ProjectRow[]>("projects", { query: "?select=*&order=created_at.desc" });
    if (!rows.length) return seedProjects;
    return rows.map(({ id, slug, title, data }) => ({ ...data, id, slug, title }) as Project);
  } catch {
    return seedProjects;
  }
}

export async function getDesigns(): Promise<Design[]> {
  try {
    const rows = await supabaseRequest<ProjectRow[]>("designs", { query: "?select=*&order=created_at.desc" });
    if (!rows.length) return seedDesigns;
    return rows.map(({ id, slug, title, data }) => ({ ...data, id, slug, title }) as Design);
  } catch {
    return seedDesigns;
  }
}
