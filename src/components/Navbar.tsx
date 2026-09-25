"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, Menu, Moon, Sun, X } from "lucide-react";
import { useAppTheme } from "@/components/ThemeProvider";

const links = [["Home", "/"], ["Projects", "/projects"], ["3D Designs", "/3d-designs"], ["Services", "/services"], ["About", "/about"], ["Contact", "/contact"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("BuildVision");
  const path = usePathname();
  const { currentTheme, setTheme } = useAppTheme();
  if (path.startsWith("/admin")) return null;
  const active = (href: string) => href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
  const toggleTheme = () => setTheme("website", currentTheme === "dark" ? "light" : "dark");
  useEffect(() => {
    fetch("/api/settings").then((response) => response.ok ? response.json() : null)
      .then((settings) => { if (settings?.companyName) setCompanyName(settings.companyName); })
      .catch(() => {});
  }, []);
  const ThemeButton = ({ mobile = false }: { mobile?: boolean }) => <button type="button" onClick={toggleTheme} aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} website theme`} title="Switch website theme" className={`grid size-10 shrink-0 place-items-center rounded-full transition ${mobile ? "border border-[color:var(--brand-line)] text-[color:var(--brand-ink)]" : "text-[color:var(--brand-ink)] hover:bg-black/5"}`}>{currentTheme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</button>;

  return <header className="public-navbar sticky top-0 z-50 border-b backdrop-blur-xl">
    <div className="public-nav-inner container flex h-[78px] items-center justify-between gap-5">
      <Link href="/" className="public-wordmark flex shrink-0 items-center gap-3" aria-label={`${companyName} home`}>
        <span className="public-mark grid size-11 place-items-center rounded-xl text-white shadow-lg"><Building2 size={21}/></span>
        <span><span className="block text-lg font-black leading-none tracking-tight">{companyName}</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[.2em] opacity-60">Built with vision</span></span>
      </Link>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={`public-nav-link relative rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${active(href) ? "is-active" : ""}`}>{label}</Link>)}
        <Link href="/booking" aria-current={active("/booking") ? "page" : undefined} className="public-cta ml-3 inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold text-white transition duration-200">Plan a consultation<ArrowRight size={15}/></Link>
        <ThemeButton/>
      </nav>
      <div className="flex items-center gap-2 lg:hidden"><ThemeButton mobile/><button className="public-mobile-menu grid size-10 place-items-center rounded-full" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={20}/> : <Menu size={20}/>}</button></div>
    </div>
    {open && <nav className="public-mobile-panel border-t px-5 py-4 lg:hidden" aria-label="Mobile navigation"><div className="container grid gap-1">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} href={href} aria-current={active(href) ? "page" : undefined} className={`rounded-xl px-4 py-3 text-sm font-semibold ${active(href) ? "public-mobile-active" : ""}`}>{label}</Link>)}<Link onClick={() => setOpen(false)} href="/booking" className="public-cta mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white">Plan a consultation<ArrowRight size={16}/></Link></div></nav>}
  </header>;
}
