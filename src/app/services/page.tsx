import PageHero from '@/components/PageHero';
import { services } from '@/lib/data';
import { Building2 } from 'lucide-react';

export default function Services() {
  return <><PageHero title="Our Services" subtitle="Comprehensive construction and design services from concept to completion."/><section className="section"><div className="container grid gap-6 md:grid-cols-3">{services.map((service)=><article className="card p-7" key={service.title}><div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#147ee8]"><Building2 size={22}/></div><h2 className="mt-6 text-xl font-black">{service.title}</h2><p className="mt-3 text-sm leading-7 text-slate-500">{service.text}</p><a href="/booking" className="mt-5 inline-block text-sm font-black text-[#147ee8]">Learn more →</a></article>)}</div></section></>;
}
