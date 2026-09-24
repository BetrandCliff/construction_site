import PageHero from "@/components/PageHero";
import Link from "next/link";
import { getDesigns } from "@/lib/projects";
export default async function Designs() {
  const projects = await getDesigns();
  return (
    <>
      <PageHero
        title="3D Designs"
        subtitle="Explore architectural concepts through immersive digital visualization."
      />
      <section className="section">
        <div className="container">
          <div className="mb-8 flex flex-wrap gap-2">
            {["All", "Residential", "Commercial", "Modern", "Traditional"].map(
              (x) => (
                <button
                  key={x}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold"
                >
                  {x}
                </button>
              ),
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <article className="card group" key={p.slug}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    alt={p.title}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-[#147ee8]">
                    {p.category}
                  </p>
                  <h3 className="mt-2 text-lg font-black">{p.title} Concept</h3>
                  <p className="mt-1 text-xs text-slate-500">{p.location}</p>
                  <Link
                    href={`/3d-designs/${p.slug}`}
                    className="mt-4 inline-block text-sm font-black text-[#147ee8]"
                  >
                    View 3D Design →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
