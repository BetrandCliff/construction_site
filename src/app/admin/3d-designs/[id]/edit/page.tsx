import Link from "next/link";
import { notFound } from "next/navigation";
import DesignEditor from "@/components/DesignEditor";
import { getDesigns } from "@/lib/projects";
export default async function EditDesignPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const designs=await getDesigns();const design=designs.find(item=>item.id===id);if(!design)return notFound();return <div><Link className="text-sm font-bold text-[#147ee8]" href="/admin/3d-designs">← 3D Designs</Link><h1 className="mt-3 text-3xl font-black">Edit {design.title}</h1><DesignEditor design={design}/></div>}
