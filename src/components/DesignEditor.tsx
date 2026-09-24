"use client";
import { FormEvent, useState } from "react";
import type { Design } from "@/lib/data";
import { uploadMediaFiles } from "@/lib/upload-media";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastProvider";

export default function DesignEditor({ design }: { design?: Design }) {
  const [status, setStatus] = useState("");
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
  return (
    <form
      onSubmit={save}
      className="card mt-8 grid max-w-4xl gap-5 p-6 md:grid-cols-2"
    >
      {fields.map(([name, label, value]) => (
        <label key={name} className="grid gap-2 text-sm font-bold">
          {label}
          <input
            required={name === "title"}
            name={name}
            type={
              [
                "bedrooms",
                "bathrooms",
                "floors",
                "kitchens",
                "livingRooms",
                "diningRooms",
                "parkingSpaces",
              ].includes(name)
                ? "number"
                : "text"
            }
            defaultValue={value}
            className="input"
          />
        </label>
      ))}
      <label className="grid gap-2 text-sm font-bold">
        Cover image{" "}
        <input
          required={!design?.image}
          name="cover_file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="input"
        />
        {design?.image && (
          <img
            src={design.image}
            alt="Current design cover"
            className="mt-2 h-28 w-44 rounded-lg object-cover"
          />
        )}
      </label>
      <label className="grid gap-2 text-sm font-bold">
        3D model file (.glb){" "}
        <input
          name="model_file"
          type="file"
          accept=".glb,model/gltf-binary,application/octet-stream"
          className="input"
        />
        {design?.modelUrl && (
          <a
            href={design.modelUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-normal text-blue-600"
          >
            Open current model
          </a>
        )}
      </label>
      <label className="grid gap-2 text-sm font-bold md:col-span-2">
        Description
        <textarea
          name="description"
          defaultValue={design?.description ?? ""}
          className="input min-h-24"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold md:col-span-2">
        Add interior/gallery images{" "}
        <input
          name="interior_files"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="input"
        />
        {!!design?.interiorImages.length && (
          <span className="text-xs font-normal text-slate-500">
            {design.interiorImages.length} existing image(s); new uploads are
            added.
          </span>
        )}
      </label>
      <button className="btn btn-primary w-fit">Save design</button>
      {status && (
        <p role="status" className="text-sm text-slate-600">
          {status}
        </p>
      )}
    </form>
  );
}
