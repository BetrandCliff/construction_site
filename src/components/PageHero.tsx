import { getSiteSettings } from "@/lib/settings";

export default async function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  const settings = await getSiteSettings();
  const image = settings.bannerImage || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80";
  return <section className="public-page-hero relative isolate overflow-hidden py-20 text-white md:py-28"><div className="public-page-hero-image absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url("${image}")` }}/><div className="public-page-hero-shade absolute inset-0 -z-10"/><div className="container"><div className="eyebrow">{settings.companyName} <span className="mx-1 text-white/40">/</span> Thoughtful spaces</div><h1 className="public-display mt-4 max-w-4xl text-5xl leading-[1.06] md:text-7xl">{title}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 md:text-base">{subtitle}</p></div></section>;
}
