import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectEditor from "@/components/ProjectEditor";

export default function NewProjectPage() {
  return <div className="admin-content"><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#147ee8] transition hover:gap-3" href="/admin/projects"><ArrowLeft size={16}/>Projects</Link><p className="mt-5 text-sm font-semibold text-[#147ee8]">Project portfolio</p><h1 className="mt-1 text-3xl font-black tracking-tight">Create a project</h1><p className="mt-2 text-sm text-slate-500">Enter project details and upload the supporting media.</p><ProjectEditor/></div>;
}
