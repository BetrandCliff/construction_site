import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data";

export default async function EditProjectPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params; const project=projects.find((item)=>item.id===id); if(!project) return notFound();
  return <div><Link className="text-sm font-bold text-[#147ee8]" href="/admin/projects">← Projects</Link><h1 className="mt-3 text-3xl font-black">Edit {project.title}</h1><form className="card mt-8 grid max-w-4xl gap-5 p-6 md:grid-cols-2">{[["Project name",project.title],["Location",project.location],["Category",project.category],["Status",project.status],["Construction duration",project.duration],["Building area",project.area],["Bedrooms",String(project.bedrooms)],["Bathrooms / toilets",String(project.bathrooms)],["Floors",String(project.floors)],["Main image URL",project.image]].map(([label,value])=><label className="grid gap-2 text-sm font-bold" key={label}>{label}<input className="input" defaultValue={value}/></label>)}<label className="grid gap-2 text-sm font-bold md:col-span-2">Description<textarea className="input min-h-28" defaultValue={project.description}/></label><p className="text-sm text-slate-500 md:col-span-2">Demo form: changes are not saved. Connect Supabase before editing live content.</p><button className="btn btn-primary w-fit" type="button" disabled>Save changes</button></form></div>;
}
