import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthenticated, supabaseRequest } from "@/lib/supabase";
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const token = (await cookies()).get("buildvision_session")?.value;
    if (!(await isAdminAuthenticated(token)))
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    let data: Record<string, unknown>;
    try {
        data = await request.json();
    } catch {
        return NextResponse.json(
            { error: "A valid JSON object is required" },
            { status: 400 },
        );
    }
    if (!data || typeof data.title !== "string" || !data.title.trim())
        return NextResponse.json(
            { error: "Design name is required" },
            { status: 400 },
        );
    const slug =
        typeof data.slug === "string" && data.slug
            ? data.slug
            : data.title
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "");
    try {
        const rows = await supabaseRequest("designs", {
            method: "PATCH",
            query: `?id=eq.${encodeURIComponent(id)}`,
            body: { title: data.title, slug, data },
        });
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Could not update design",
            },
            { status: 503 },
        );
    }
}
