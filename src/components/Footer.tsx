"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Building2, Mail, MapPin, Phone } from "lucide-react";

type SiteSettings = { companyName: string; email: string; phone: string; location: string };

export default function Footer() {
  const path = usePathname();
  const [settings, setSettings] = useState<SiteSettings>({ companyName: "BuildVision", email: "hello@buildvision.cm", phone: "+237 6XX XXX XXX", location: "Buea, Cameroon" });
  useEffect(() => { fetch("/api/settings").then((response) => response.ok ? response.json() : null).then((data) => data && setSettings((value) => ({ ...value, ...data }))).catch(() => {}); }, []);
  if (path.startsWith("/admin")) return null;

  return <footer className="public-footer text-white">
    <div className="container grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_1fr] lg:py-16">
      <div>
        <Link href="/" className="flex w-fit items-center gap-3"><span className="public-footer-mark grid size-11 place-items-center rounded-xl"><Building2 size={21}/></span><span><span className="block text-lg font-black leading-none">{settings.companyName}</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[.2em] text-white/50">Construction · Architecture · Design</span></span></Link>
        <p className="mt-5 max-w-md text-sm leading-7 text-white/65">Thoughtful spaces, expertly built. We bring construction, architecture and 3D visualization together to move your ideas from first sketch to finished place.</p>
        <Link href="/booking" className="public-footer-link mt-6 inline-flex items-center gap-2 text-sm font-bold">Start a conversation<ArrowUpRight size={16}/></Link>
      </div>
      <div><h2 className="text-xs font-bold uppercase tracking-[.16em] text-white/45">Explore</h2><nav className="mt-5 grid gap-3 text-sm text-white/75">{[["Projects", "/projects"], ["3D Designs", "/3d-designs"], ["Our services", "/services"], ["About us", "/about"], ["Contact", "/contact"]].map(([label, href]) => <Link className="public-footer-nav w-fit transition-colors" href={href} key={href}>{label}</Link>)}</nav></div>
      <div><h2 className="text-xs font-bold uppercase tracking-[.16em] text-white/45">Get in touch</h2><div className="mt-5 grid gap-4 text-sm text-white/75"><p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-[color:var(--brand-accent)]"/>{settings.location}</p><a className="flex items-center gap-3 transition hover:text-white" href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}><Phone size={16} className="text-[color:var(--brand-accent)]"/>{settings.phone}</a><a className="flex items-center gap-3 transition hover:text-white" href={`mailto:${settings.email}`}><Mail size={16} className="text-[color:var(--brand-accent)]"/>{settings.email}</a></div></div>
    </div>
    <div className="public-footer-bottom border-t border-white/10"><div className="container flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/45"><span>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</span><span>Designed to build what matters.</span></div></div>
  </footer>;
}
