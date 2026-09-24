 "use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [["Home","/"],["3d-Design","/3d-designs"],["Projects","/projects"],["Services","/services"],["Booking","/booking"],["About","/about"],["Contact","/contact"]];
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="container h-18 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight">Build<span className="text-amber-600">Space</span></Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          {links.map(([label,href]) => <Link key={href} href={href} className="hover:text-amber-600 transition">{label}</Link>)}
          <Link href="/contact" className="btn btn-primary">Get a Quote</Link>
        </nav>
        <button className="md:hidden p-2" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open ? <X/>:<Menu/>}</button>
      </div>
      {open && <nav className="md:hidden border-t bg-white px-4 py-4 space-y-1">
        {links.map(([label,href]) => <Link onClick={()=>setOpen(false)} key={href} href={href} className="block rounded-lg px-3 py-3 font-semibold hover:bg-gray-100">{label}</Link>)}
        <Link onClick={()=>setOpen(false)} href="/contact" className="btn btn-primary w-full mt-2">Get a Quote</Link>
      </nav>}
    </header>
  );
}