import { Plus, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { getDesigns } from "@/lib/projects";
export default async function AdminDesigns() {
  const projects = await getDesigns();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Model library</p>
          <h1 className="text-3xl font-black">3D Designs</h1>
        </div>
        <Link href="/admin/3d-designs/new" className="btn btn-primary">
          <Plus size={17} />
          Upload Design
        </Link>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {projects.slice(0, 6).map((p) => (
          <article className="card" key={p.slug}>
            <img
              src={p.image}
              className="aspect-video w-full object-cover"
              alt=""
            />
            <div className="p-5">
              <h2 className="font-black">{p.title} Concept</h2>
              <p className="mt-1 text-xs text-slate-500">GLB • Published</p>
              <div className="mt-4 flex gap-4 text-slate-500">
                <Link aria-label={`View ${p.title}`} href={`/3d-designs/${p.slug}`}><Eye size={17} /></Link>
                <Link aria-label={`Edit ${p.title}`} href={`/admin/3d-designs/${p.id}/edit`}><Pencil size={17} /></Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
