import { Mail, Phone } from "lucide-react";

const messages = [
  { name: "Amina M.", email: "amina@example.com", subject: "New family home", date: "Sep 22, 2026", message: "I would like to discuss designing a three bedroom family home in Buea." },
  { name: "David N.", email: "david@example.com", subject: "Office renovation", date: "Sep 20, 2026", message: "Please share more information about your commercial renovation services." },
];

export default function MessagesPage() {
  return <div><p className="text-sm text-slate-500">Visitor enquiries</p><h1 className="text-3xl font-black">Messages</h1><div className="mt-8 grid gap-4">{messages.map((m) => <article className="card p-6" key={m.email}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-black">{m.subject}</h2><p className="mt-1 text-sm text-slate-500">{m.name} · {m.date}</p></div><a className="inline-flex items-center gap-2 text-sm font-bold text-[#147ee8]" href={`mailto:${m.email}`}><Mail size={15}/>{m.email}</a></div><p className="mt-4 leading-7 text-slate-600">{m.message}</p></article>)}</div></div>;
}
