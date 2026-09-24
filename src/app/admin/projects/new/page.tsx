import Link from "next/link";
import ProjectEditor from "@/components/ProjectEditor";
export default function NewProjectPage(){return <div><Link className="text-sm font-bold text-[#147ee8]" href="/admin/projects">← Projects</Link><h1 className="mt-3 text-3xl font-black">Create a project</h1><ProjectEditor/></div>}
