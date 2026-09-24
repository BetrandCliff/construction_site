import Link from "next/link";
import { notFound } from "next/navigation";
import { designs } from "@/lib/data";

export default async function EditDesignPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params; const design=designs.find((item)=>item.id===id); if(!design) return notFound();
  return <div><Link className="text-sm font-bold text-[#147ee8]" href="/admin/3d-designs">← 3D Designs</Link><h1 className="mt-3 text-3xl font-black">Edit {design.title}</h1><form className="card mt-8 grid max-w-4xl gap-5 p-6 md:grid-cols-2">{[["Design name",design.title],["Bedrooms",String(design.bedrooms)],["Bathrooms / toilets",String(design.bathrooms)],["Floors",String(design.floors)],["Parking spaces",String(design.parkingSpaces)],["Building area",design.area],["Land requirements",design.landSize],["Exterior image URL",design.image]].map(([label,value])=><label className="grid gap-2 text-sm font-bold" key={label}>{label}<input className="input" defaultValue={value}/></label>)}<label className="grid gap-2 text-sm font-bold md:col-span-2">Description<textarea className="input min-h-28" defaultValue={design.description}/></label><label className="grid gap-2 text-sm font-bold md:col-span-2">3D model URL (.glb or .gltf)<input className="input" defaultValue={design.modelUrl??""}/></label><p className="text-sm text-slate-500 md:col-span-2">Demo form: changes are not saved. Connect Supabase and Storage before editing live content.</p><button className="btn btn-primary w-fit" type="button" disabled>Save changes</button></form></div>;
}
