import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { projects } from "@/lib/data";
export default function AdminDesigns() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Model library</p>
          <h1 className="text-3xl font-black">3D Designs</h1>
        </div>
        <button className="btn btn-primary">
          <Plus size={17} />
          Upload Design
        </button>
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
                <Eye size={17} />
                <Pencil size={17} />
                <Trash2 size={17} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
