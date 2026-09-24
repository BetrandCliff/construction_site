"use client";
import { FormEvent, useState } from "react";
import type { Design } from "@/lib/data";
import { uploadMediaFiles } from "@/lib/upload-media";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastProvider";

export default function DesignEditor({ design }: { design?: Design }) {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const entries = new FormData(form);
    const raw = Object.fromEntries(
      [...entries.entries()].filter(
        ([key]) => !key.endsWith("_file") && key !== "interior_files",
      ),
    );
    try {
      setSaving(true);
      let image = design?.image ?? "";
      const imageFiles = (
        form.elements.namedItem("cover_file") as HTMLInputElement
      ).files;
      if (imageFiles?.length) {
        setStatus("Uploading design cover…");
        image = (await uploadMediaFiles(imageFiles, "designs"))[0];
      }
      if (!image) throw new Error("Choose a design cover image.");
      let modelUrl = design?.modelUrl ?? "";
      const modelFiles = (
        form.elements.namedItem("model_file") as HTMLInputElement
      ).files;
      if (modelFiles?.length) {
        setStatus("Uploading 3D model…");
        modelUrl = (await uploadMediaFiles(modelFiles, "designs"))[0];
      }
      let interiorImages = design?.interiorImages ?? [];
      const interiorFiles = (
        form.elements.namedItem("interior_files") as HTMLInputElement
      ).files;
      if (interiorFiles?.length) {
        setStatus("Uploading gallery images…");
        interiorImages = [
          ...interiorImages,
          ...(await uploadMediaFiles(interiorFiles, "designs")),
        ];
      }
      const title = String(raw.title ?? "");
      const data = {
        ...design,
        ...raw,
        title,
        image,
        modelUrl,
        interiorImages,
        slug:
          design?.slug ??
          title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        bedrooms: Number(raw.bedrooms || 0),
        bathrooms: Number(raw.bathrooms || 0),
        floors: Number(raw.floors || 1),
        parkingSpaces: Number(raw.parkingSpaces || 0),
        kitchens: Number(raw.kitchens || 1),
        livingRooms: Number(raw.livingRooms || 1),
        diningRooms: Number(raw.diningRooms || 1),
        specifications: design?.specifications ?? [],
      };
      setStatus("Saving design…");
      const response = await fetch(
        design ? `/api/designs/${design.id}` : "/api/designs",
        {
          method: design ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not save design");
      showToast("Design saved successfully.");
      router.push("/admin/3d-designs");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save design";
      setStatus(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  const fields: [string, string, string][] = [
    ["title", "Design name", design?.title ?? ""],
    ["bedrooms", "Bedrooms", String(design?.bedrooms ?? 0)],
    ["bathrooms", "Bathrooms / toilets", String(design?.bathrooms ?? 0)],
    ["floors", "Floors", String(design?.floors ?? 1)],
    ["kitchens", "Kitchens", String(design?.kitchens ?? 1)],
    ["livingRooms", "Living rooms", String(design?.livingRooms ?? 1)],
    ["diningRooms", "Dining areas", String(design?.diningRooms ?? 1)],
    ["parkingSpaces", "Parking spaces", String(design?.parkingSpaces ?? 0)],
    ["dimensions", "Building dimensions", design?.dimensions ?? ""],
    ["area", "Building area", design?.area ?? ""],
    ["landSize", "Land requirements", design?.landSize ?? ""],
    [
      "estimatedConstruction",
      "Estimated construction",
      design?.estimatedConstruction ?? "",
    ],
  ];
  return <form onSubmit={save} className="admin-editor mt-8 grid max-w-5xl gap-5">
    <section className="card p-6 md:p-7"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-wider text-[#147ee8]">01 · Specifications</p><h2 className="mt-1 text-lg font-black">Design details</h2><p className="mt-1 text-sm text-slate-500">Set the design name, building dimensions and room counts.</p></div><div className="grid gap-5 md:grid-cols-2">{fields.map(([name, label, value]) => <label key={name} className="grid gap-2 text-sm font-semibold text-slate-700">{label}<input required={name === "title"} name={name} type={["bedrooms", "bathrooms", "floors", "kitchens", "livingRooms", "diningRooms", "parkingSpaces"].includes(name) ? "number" : "text"} defaultValue={value} className="input"/></label>)}</div></section>
    <section className="card p-6 md:p-7"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-wider text-[#147ee8]">02 · Media</p><h2 className="mt-1 text-lg font-black">Design files and imagery</h2><p className="mt-1 text-sm text-slate-500">Upload a cover, optional GLB model and interior gallery images.</p></div><div className="grid gap-5 md:grid-cols-2">
      <label className="grid content-start gap-2 text-sm font-semibold text-slate-700">Cover image<input required={!design?.image} name="cover_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="input"/>{design?.image&&<img src={design.image} alt="Current design cover" className="mt-2 aspect-video w-full rounded-xl object-cover"/>}</label>
      <label className="grid content-start gap-2 text-sm font-semibold text-slate-700">3D model file (.glb)<input name="model_file" type="file" accept=".glb,model/gltf-binary,application/octet-stream" className="input"/>{design?.modelUrl&&<a href={design.modelUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#147ee8] hover:underline">Open current model</a>}</label>
      <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">Interior/gallery images<input name="interior_files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="input"/>{!!design?.interiorImages.length&&<span className="text-xs font-normal text-slate-500">{design.interiorImages.length} existing image(s); new uploads are added to the gallery.</span>}</label>
    </div></section>
    <section className="card p-6 md:p-7"><p className="text-xs font-bold uppercase tracking-wider text-[#147ee8]">03 · Description</p><h2 className="mt-1 text-lg font-black">Design overview</h2><label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">Description<textarea name="description" defaultValue={design?.description ?? ""} className="input min-h-32" placeholder="Explain the design concept and key features…"/></label></section>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"><p role="status" className="text-sm text-slate-500">{status || "Uploads and design details are saved together."}</p><button disabled={saving} className="btn btn-primary min-w-36 disabled:opacity-60">{saving ? "Saving design…" : design ? "Save changes" : "Create design"}</button></div>
  </form>;
}
