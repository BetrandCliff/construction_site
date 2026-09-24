"use client";
import { Fragment, useEffect, useState } from "react";
import { CalendarDays, Check, Search, X } from "lucide-react";
import { showToast } from "@/components/ToastProvider";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service?: string | null;
  service_id?: string | null;
  project_id?: string | null;
  design_id?: string | null;
  appointment_date: string;
  appointment_time: string;
  message: string | null;
  admin_notes?: string | null;
  status: string;
};

const labelStatus = (status: string) => status ? status[0].toUpperCase() + status.slice(1).toLowerCase() : "Pending";

export default function AdminAppointments() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/appointments").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRows(data);
    }).catch((reason) => setError(reason.message));
  }, []);

  async function changeStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update appointment status.");
      setRows((items) => items.map((item) => item.id === id ? { ...item, status } : item));
      showToast(`Appointment ${status} successfully.`);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not update appointment status.";
      setError(message);
      showToast(message, "error");
    }
  }

  const filtered = rows.filter((row) => [row.name, row.email, row.phone, row.service, row.service_id, row.project_id, row.design_id, row.status, row.message]
    .some((value) => value?.toLowerCase().includes(query.toLowerCase())));

  return <div>
    <p className="text-sm text-slate-500">Scheduling</p><h1 className="text-3xl font-black">Appointments</h1>
    <div className="card mt-8 overflow-hidden">
      <div className="flex flex-wrap gap-3 border-b p-5"><div className="flex flex-1 items-center gap-2 rounded-lg border px-3"><Search size={16} className="text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full py-2 text-sm outline-none" placeholder="Search appointments…"/></div><span className="btn btn-outline"><CalendarDays size={16}/>All Dates</span></div>
      {error && <p role="alert" className="p-4 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#f4f7fb] text-xs uppercase text-slate-500"><tr><th className="p-4">Client</th><th className="p-4">Service</th><th className="p-4">Date / time</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
        <tbody>{filtered.map((row) => <Fragment key={row.id}>
          <tr className="border-t" key={row.id}><td className="p-4"><span className="font-bold">{row.name}</span><button onClick={() => setExpanded(expanded === row.id ? null : row.id)} className="mt-1 block text-xs font-bold text-[#147ee8]">{expanded === row.id ? "Hide details" : "View details"}</button></td><td className="p-4">{row.service || (row.service_id ? `Service ${row.service_id}` : "—")}</td><td className="p-4">{row.appointment_date} {row.appointment_time}</td><td className="p-4"><span className="badge">{labelStatus(row.status)}</span></td><td className="p-4"><div className="flex gap-2"><button aria-label="Confirm appointment" onClick={() => changeStatus(row.id, "confirmed")} className="grid size-8 place-items-center rounded bg-emerald-50 text-emerald-600"><Check size={15}/></button><button aria-label="Cancel appointment" onClick={() => changeStatus(row.id, "cancelled")} className="grid size-8 place-items-center rounded bg-red-50 text-red-600"><X size={15}/></button></div></td></tr>
          {expanded === row.id && <tr key={`${row.id}-details`} className="bg-slate-50"><td colSpan={5} className="p-5"><div className="grid gap-4 md:grid-cols-3"><div><p className="text-xs font-bold uppercase text-slate-500">Email</p><a className="mt-1 block text-[#147ee8]" href={`mailto:${row.email}`}>{row.email}</a></div><div><p className="text-xs font-bold uppercase text-slate-500">Phone</p>{row.phone ? <a className="mt-1 block text-[#147ee8]" href={`tel:${row.phone}`}>{row.phone}</a> : <p className="mt-1">—</p>}</div><div><p className="text-xs font-bold uppercase text-slate-500">Service</p><p className="mt-1">{row.service || row.service_id || "—"}</p></div>{row.project_id&&<div><p className="text-xs font-bold uppercase text-slate-500">Project ID</p><p className="mt-1 break-all">{row.project_id}</p></div>}{row.design_id&&<div><p className="text-xs font-bold uppercase text-slate-500">Design ID</p><p className="mt-1 break-all">{row.design_id}</p></div>}<div className="md:col-span-3"><p className="text-xs font-bold uppercase text-slate-500">Project details</p><p className="mt-1 whitespace-pre-wrap">{row.message || "No additional details provided."}</p></div>{row.admin_notes&&<div className="md:col-span-3"><p className="text-xs font-bold uppercase text-slate-500">Admin notes</p><p className="mt-1 whitespace-pre-wrap">{row.admin_notes}</p></div>}</div></td></tr>}
        </Fragment>)}</tbody>
      </table>{!filtered.length && !error && <p className="p-5 text-sm text-slate-500">No appointments found.</p>}</div>
    </div>
  </div>;
}
