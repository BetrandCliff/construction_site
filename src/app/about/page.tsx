import PageHero from "@/components/PageHero";
import {getSiteSettings} from "@/lib/settings";
export const dynamic = "force-dynamic";
export default async function About() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        title={settings.aboutTitle}
        subtitle={settings.aboutSubtitle}
      />
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <img
            className="rounded-3xl object-cover"
            src={settings.aboutImage || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"}
            alt="Modern architecture"
          />
          <div>
            <div className="eyebrow">{settings.aboutStoryLabel}</div>
            <h2 className="section-title">
              {settings.aboutStoryTitle}
            </h2>
            <p className="leading-8 text-slate-600">
              {settings.aboutStory}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {settings.aboutStats.map(({ value, label }) => (
                <div className="rounded-xl bg-[#f4f7fb] p-5" key={label}>
                  <div className="text-3xl font-black text-[#147ee8]">{value}</div>
                  <div className="mt-1 text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f4f7fb] py-20">
        <div className="container">
          <div className="eyebrow">{settings.aboutValuesLabel}</div>
          <h2 className="section-title">{settings.aboutValuesTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {settings.aboutValues.map(({ title, description }) => (
                <div className="card p-6" key={title}>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
