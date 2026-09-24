import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Maximize2, Rotate3D, ZoomIn, Move3D } from "lucide-react";
import { projects } from "@/lib/data";
export default async function DesignDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return notFound();
  return (
    <>
      <div className="container py-7">
        <Link
          href="/3d-designs"
          className="flex items-center gap-2 text-sm font-bold text-slate-500"
        >
          <ArrowLeft size={16} />
          Back to 3D Designs
        </Link>
      </div>
      <section className="pb-20">
        <div className="container grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <div className="overflow-hidden rounded-3xl bg-slate-950 p-4">
            <div className="relative aspect-video overflow-hidden rounded-2xl">
              <img
                src={p.image}
                className="h-full w-full object-cover opacity-80"
                alt={p.title}
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full bg-white/15 p-5 backdrop-blur">
                  <Rotate3D size={34} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white">
                <span className="flex gap-4">
                  <Move3D />
                  <ZoomIn />
                  <Maximize2 />
                </span>
                <span className="rounded bg-black/50 px-3 py-1 text-xs">
                  Interactive Preview
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="eyebrow">{p.category}</div>
            <h1 className="mt-2 text-4xl font-black">{p.title} Concept</h1>
            <p className="mt-5 leading-7 text-slate-600">
              {p.description} This 3D concept is intended to help clients
              understand massing, proportions, materials and spatial character
              before construction.
            </p>
            <div className="mt-7 rounded-2xl bg-[#f4f7fb] p-5">
              <p className="font-black">Interested in this design?</p>
              <p className="mt-2 text-sm text-slate-500">
                Book a consultation to discuss adapting the concept to your site
                and requirements.
              </p>
              <Link href="/booking" className="btn btn-primary mt-5 w-full">
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
