"use client";
import { FormEvent, useState } from "react";
import type { Project } from "@/lib/data";
import { uploadMediaFiles } from "@/lib/upload-media";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastProvider";

export default function ProjectEditor({ project }: { project?: Project }) {
  const [status, setStatus] = useState("");
  const router = useRouter();
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const raw = Object.fromEntries([...formData.entries()].filter(([key]) => !key.endsWith("_files")));
    try {
      const mainFiles = (form.elements.namedItem("main_image_files") as HTMLInputElement).files;
      const galleryFiles = (form.elements.namedItem("gallery_files") as HTMLInputElement).files;
      let image = project?.image ?? "";
      if (mainFiles?.length) { setStatus("Uploading main project image…"); image = (await uploadMediaFiles(mainFiles, "projects"))[0]; }
      if (!image) throw new Error("Choose a main project image.");
      let gallery = project?.gallery ?? [];
      if (galleryFiles?.length) { setStatus("Uploading gallery images…"); gallery = [...gallery, ...await uploadMediaFiles(galleryFiles, "projects")]; }
      const uploadList = async (field: string, current: string[] = []) => { const files = (form.elements.namedItem(field) as HTMLInputElement).files; return files?.length ? [...current, ...await uploadMediaFiles(files, "projects")] : current; };
      setStatus("Uploading project plans and documents…");
      const floorPlans = await uploadList("floor_plan_files", project?.floorPlans);
      const architecturalDrawings = await uploadList("architectural_files", project?.architecturalDrawings);
      const structuralDrawings = await uploadList("structural_files", project?.structuralDrawings);
      const documents = await uploadList("document_files", project?.documents);
      const title = String(raw.title ?? "");
      const data = { ...project, ...raw, title, image, gallery, slug: project?.slug ?? title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), bedrooms: Number(raw.bedrooms || 0), bathrooms: Number(raw.bathrooms || 0), floors: Number(raw.floors || 1), floorPlans, architecturalDrawings, structuralDrawings, documents };
      setStatus("Saving project…");
      const response = await fetch(project ? `/api/projects/${project.id}` : "/api/projects", { method: project ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save project");
      showToast("Project saved successfully.");
      router.push("/admin/projects");
    } catch (error) { const message=error instanceof Error ? error.message : "Could not save project.";setStatus(message);showToast(message,"error"); }
  }

  const fields: [string, string, string][] = [["title", "Project name", project?.title ?? ""], ["location", "Location", project?.location ?? ""], ["category", "Category", project?.category ?? "Residential"], ["status", "Status", project?.status ?? "Published"], ["duration", "Construction duration", project?.duration ?? ""], ["area", "Building area", project?.area ?? ""], ["landSize", "Land size", project?.landSize ?? ""], ["bedrooms", "Bedrooms", String(project?.bedrooms ?? 0)], ["bathrooms", "Bathrooms / toilets", String(project?.bathrooms ?? 0)], ["floors", "Floors", String(project?.floors ?? 1)]];
  return <form onSubmit={save} className="card mt-8 grid max-w-4xl gap-5 p-6 md:grid-cols-2">
    {fields.map(([name,label,value]) => <label className="grid gap-2 text-sm font-bold" key={name}>{label}{name === "category" ? <select name={name} defaultValue={value} className="input"><option>Residential</option><option>Commercial</option></select> : name === "status" ? <select name={name} defaultValue={value} className="input"><option>Published</option><option>In Progress</option><option>Completed</option></select> : <input required={name === "title"} name={name} type={["bedrooms","bathrooms","floors"].includes(name) ? "number" : "text"} defaultValue={value} className="input"/>}</label>)}
    <label className="grid gap-2 text-sm font-bold">Main project image <input required={!project?.image} name="main_image_files" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="input"/>{project?.image&&<img src={project.image} alt="Current project cover" className="mt-2 h-28 w-44 rounded-lg object-cover"/>}</label>
    <label className="grid gap-2 text-sm font-bold">Add gallery images <input name="gallery_files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="input"/>{!!project?.gallery.length&&<span className="text-xs font-normal text-slate-500">{project.gallery.length} existing gallery image(s); new uploads are added to the gallery.</span>}</label>
    <label className="grid gap-2 text-sm font-bold md:col-span-2">Floor plan files (images or PDFs)<input name="floor_plan_files" type="file" multiple accept="image/*,application/pdf" className="input"/>{!!project?.floorPlans.length&&<span className="text-xs font-normal text-slate-500">{project.floorPlans.length} existing file(s)</span>}</label>
    <label className="grid gap-2 text-sm font-bold md:col-span-2">Architectural drawings (images or PDFs)<input name="architectural_files" type="file" multiple accept="image/*,application/pdf" className="input"/>{!!project?.architecturalDrawings.length&&<span className="text-xs font-normal text-slate-500">{project.architecturalDrawings.length} existing file(s)</span>}</label>
    <label className="grid gap-2 text-sm font-bold md:col-span-2">Structural drawings (images or PDFs)<input name="structural_files" type="file" multiple accept="image/*,application/pdf" className="input"/>{!!project?.structuralDrawings.length&&<span className="text-xs font-normal text-slate-500">{project.structuralDrawings.length} existing file(s)</span>}</label>
    <label className="grid gap-2 text-sm font-bold md:col-span-2">Project documents (images or PDFs)<input name="document_files" type="file" multiple accept="image/*,application/pdf" className="input"/>{!!project?.documents.length&&<span className="text-xs font-normal text-slate-500">{project.documents.length} existing file(s)</span>}</label>
    <label className="grid gap-2 text-sm font-bold md:col-span-2">Description<textarea name="description" defaultValue={project?.description ?? ""} className="input min-h-28"/></label>
    <button className="btn btn-primary w-fit">Save project</button>{status&&<p role="status" className="text-sm text-slate-600">{status}</p>}
  </form>;
}
