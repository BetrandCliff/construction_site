import PageHero from "@/components/PageHero";
import {getSiteSettings} from "@/lib/settings";
export default async function About() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Building dreams, creating lasting value."
      />
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <img
            className="rounded-3xl object-cover"
            src={settings.aboutImage || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"}
            alt="Modern architecture"
          />
          <div>
            <div className="eyebrow">Our Story</div>
            <h2 className="section-title">
              Construction with clarity from concept to completion.
            </h2>
            <p className="leading-8 text-slate-600">
              {settings.companyName} is a construction and architectural design business
              focused on thoughtful planning, quality execution and modern
              visualization. Our approach combines practical construction
              knowledge with 3D design so clients can make confident decisions
              early.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["100+", "Projects"],
                ["50+", "Happy Clients"],
                ["5+", "Years Experience"],
                ["10+", "Professionals"],
              ].map(([n, l]) => (
                <div className="rounded-xl bg-[#f4f7fb] p-5" key={l}>
                  <div className="text-3xl font-black text-[#147ee8]">{n}</div>
                  <div className="mt-1 text-sm text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f4f7fb] py-20">
        <div className="container">
          <div className="eyebrow">Our Values</div>
          <h2 className="section-title">Principles behind every project.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {["Quality", "Integrity", "Innovation", "Customer Focus"].map(
              (x) => (
                <div className="card p-6" key={x}>
                  <h3 className="font-black">{x}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    We make decisions with long-term value and client needs in
                    mind.
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
