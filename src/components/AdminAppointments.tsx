"use client";

import { Fragment, useEffect, useState } from "react";
import { CalendarDays, Check, Clock3, LayoutGrid, Mail, MapPin, Phone, Search, Table2, X } from "lucide-react";
import { showToast } from "@/components/ToastProvider";

type Appointment = {
  id: string; name: string; email: string; phone: string | null;
  service?: string | null; service_id?: string | null; project_id?: string | null; design_id?: string | null;
  appointment_date: string; appointment_time: string; message: string | null; admin_notes?: string | null; status: string;
};

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "confirmed") return "bg-emerald-50 text-emerald-700";
  if (normalized === "cancelled") return "bg-red-50 text-red-700";
  if (normalized === "completed") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass(status)}`}>{status}</span>;
}

export default function AdminAppointments() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRows(data);
    }).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  async function changeStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update appointment status.");
      setRows((items) => items.map((item) => item.id === id ? { ...item, ...(result.appointment ?? {}), status } : item));
      if (result.emailWarning) showToast(`Appointment ${status} successfully, but the email was not sent. ${result.emailWarning}`, "error");
      else showToast(`Appointment ${status} successfully. Email sent to the client.`);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not update appointment status.";
      setError(message);
      showToast(message, "error");
    }
  }

  const filtered = rows.filter((row) => [row.name, row.email, row.phone, row.service, row.service_id, row.project_id, row.design_id, row.status, row.message]
    .some((value) => value?.toLowerCase().includes(query.toLowerCase())));

  function Actions({ row }: { row: Appointment }) {
    return <div className="flex flex-wrap gap-2">
      <button type="button" disabled={row.status.toLowerCase() === "confirmed"} onClick={() => changeStatus(row.id, "confirmed")} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"><Check size={14}/>Approve</button>
      <button type="button" disabled={row.status.toLowerCase() === "cancelled"} onClick={() => changeStatus(row.id, "cancelled")} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"><X size={14}/>Cancel</button>
    </div>;
  }

  return <div className="admin-content">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-[#147ee8]">Scheduling</p><h1 className="mt-1 text-3xl font-black tracking-tight">Appointments</h1><p className="mt-2 text-sm text-slate-500">Review client requests, manage status and contact clients.</p></div><div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"><span className="font-black">{filtered.length}</span><span className="ml-2 text-slate-500">{query ? "matching" : "total"}</span></div></div>

    <section className="card mt-8 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4 md:p-5"><div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3"><Search size={16} className="shrink-0 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-0 bg-transparent py-2.5 text-sm outline-none" placeholder="Search clients or appointments…"/></div>
        <div role="group" aria-label="Appointment view" className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1"><button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${view === "cards" ? "bg-white text-[#147ee8] shadow-sm" : "text-slate-500"}`}><LayoutGrid size={16}/>Cards</button><button type="button" aria-pressed={view === "table"} onClick={() => setView("table")} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${view === "table" ? "bg-white text-[#147ee8] shadow-sm" : "text-slate-500"}`}><Table2 size={16}/>Table</button></div>
      </div>
      {error && <p role="alert" className="p-4 text-sm text-red-600">{error}</p>}
      {loading ? <div className="p-10 text-center text-sm text-slate-500">Loading appointments…</div> : !filtered.length ? <div className="p-12 text-center"><CalendarDays className="mx-auto text-slate-400"/><p className="mt-3 font-bold">No appointments found</p><p className="mt-1 text-sm text-slate-500">New client requests will appear here.</p></div> : view === "cards" ? <div className="grid gap-4 p-4 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((row) => <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-black">{row.name}</h2><p className="mt-1 text-sm text-slate-500">{row.service || row.service_id || "Consultation"}</p></div><StatusBadge status={row.status}/></div>
        <div className="mt-5 grid gap-3 text-sm text-slate-600"><p className="flex items-center gap-2"><CalendarDays size={15} className="text-[#147ee8]"/>{row.appointment_date}</p><p className="flex items-center gap-2"><Clock3 size={15} className="text-[#147ee8]"/>{row.appointment_time}</p><a className="flex items-center gap-2 truncate text-[#147ee8] hover:underline" href={`mailto:${row.email}`}><Mail size={15}/>{row.email}</a>{row.phone && <a className="flex items-center gap-2 text-[#147ee8] hover:underline" href={`tel:${row.phone}`}><Phone size={15}/>{row.phone}</a>}</div>
        {row.message && <p className="mt-4 line-clamp-2 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">{row.message}</p>}
        {expanded === row.id && <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">{row.project_id && <p>Project ID: <span className="break-all">{row.project_id}</span></p>}{row.design_id && <p>Design ID: <span className="break-all">{row.design_id}</span></p>}{row.admin_notes && <p>Admin notes: {row.admin_notes}</p>}</div>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={() => setExpanded(expanded === row.id ? null : row.id)} className="text-xs font-bold text-[#147ee8]">{expanded === row.id ? "Hide extra details" : "More details"}</button><Actions row={row}/></div>
      </article>)}</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#f4f7fb] text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Client</th><th className="p-4">Service</th><th className="p-4">Date / time</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>
        {filtered.map((row) => <Fragment key={row.id}><tr className="border-t"><td className="p-4"><span className="font-bold">{row.name}</span><button onClick={() => setExpanded(expanded === row.id ? null : row.id)} className="mt-1 block text-xs font-bold text-[#147ee8]">{expanded === row.id ? "Hide details" : "View details"}</button></td><td className="p-4">{row.service || row.service_id || "—"}</td><td className="p-4">{row.appointment_date}<span className="block text-xs text-slate-500">{row.appointment_time}</span></td><td className="p-4"><StatusBadge status={row.status}/></td><td className="p-4"><Actions row={row}/></td></tr>
          {expanded === row.id && <tr className="bg-slate-50"><td colSpan={5} className="p-5"><div className="grid gap-4 md:grid-cols-3"><div><p className="text-xs font-bold uppercase text-slate-500">Email</p><a className="mt-1 block text-[#147ee8]" href={`mailto:${row.email}`}>{row.email}</a></div><div><p className="text-xs font-bold uppercase text-slate-500">Phone</p>{row.phone ? <a className="mt-1 block text-[#147ee8]" href={`tel:${row.phone}`}>{row.phone}</a> : <p className="mt-1">—</p>}</div>{row.project_id && <p className="break-all"><MapPin size={14} className="mr-1 inline"/>Project: {row.project_id}</p>}{row.design_id && <p className="break-all">Design ID: {row.design_id}</p>}<div className="md:col-span-3"><p className="text-xs font-bold uppercase text-slate-500">Project details</p><p className="mt-1 whitespace-pre-wrap">{row.message || "No additional details provided."}</p></div>{row.admin_notes && <div className="md:col-span-3"><p className="text-xs font-bold uppercase text-slate-500">Admin notes</p><p className="mt-1 whitespace-pre-wrap">{row.admin_notes}</p></div>}</div></td></tr>}</Fragment>)}
      </tbody></table></div>}
    </section>
  </div>;
}
