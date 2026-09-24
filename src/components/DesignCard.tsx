import Link from "next/link";
import { BedDouble, Bath, Toilet, Maximize } from "lucide-react";
import type { Design } from "@/data/designs";

export default function DesignCard({d}:{d:Design}) {
  return <article className="card">
    <img src={d.image} alt={d.title} className="w-full h-60 object-cover"/>
    <div className="p-5">
      <div className="flex justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wider text-amber-700">{d.category}</span><span className="text-xs bg-gray-100 rounded-full px-2 py-1">{d.status}</span></div>
      <h3 className="text-xl font-bold mt-2">{d.title}</h3>
      <p className="muted text-sm mt-1">{d.location} · {d.area}</p>
      <div className="grid grid-cols-4 gap-2 mt-5 text-xs">
        <div className="bg-gray-50 p-2 rounded-lg"><BedDouble size={16}/><b>{d.bedrooms}</b> beds</div>
        <div className="bg-gray-50 p-2 rounded-lg"><Bath size={16}/><b>{d.bathrooms}</b> baths</div>
        <div className="bg-gray-50 p-2 rounded-lg"><Toilet size={16}/><b>{d.toilets}</b> toilets</div>
        <div className="bg-gray-50 p-2 rounded-lg"><Maximize size={16}/><b>{d.area.split(" ")[0]}</b>m²</div>
      </div>
      <Link href={`/designs/${d.slug}`} className="btn btn-dark w-full mt-5">View Full Design</Link>
    </div>
  </article>
}