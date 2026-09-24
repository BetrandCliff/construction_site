import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectEditor from "@/components/ProjectEditor";
import { getProjects } from "@/lib/projects";
export default async function EditProjectPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const projects=await getProjects();const project=projects.find(item=>item.id===id);if(!project)return notFound();return <div><Link className="text-sm font-bold text-[#147ee8]" href="/admin/projects">← Projects</Link><h1 className="mt-3 text-3xl font-black">Edit {project.title}</h1><ProjectEditor project={project}/></div>}
