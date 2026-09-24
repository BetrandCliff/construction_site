import { Search, Check, X, CalendarDays } from "lucide-react";
export default function AdminAppointments() {
  const rows = [
    ["John Doe", "Consultation", "Sep 29, 2026", "Pending"],
    ["Mary Smith", "3D Design", "Sep 30, 2026", "Confirmed"],
    ["Peter John", "Construction", "Oct 02, 2026", "Completed"],
    ["Lisa Brown", "Renovation", "Oct 03, 2026", "Cancelled"],
  ];
  return (
    <div>
      <div>
        <p className="text-sm text-slate-500">Scheduling</p>
        <h1 className="text-3xl font-black">Appointments</h1>
      </div>
      <div className="card mt-8 overflow-hidden">
        <div className="flex flex-wrap gap-3 border-b p-5">
          <div className="flex flex-1 items-center gap-2 rounded-lg border px-3">
            <Search size={16} className="text-slate-400" />
            <input
              className="w-full py-2 text-sm outline-none"
              placeholder="Search appointments..."
            />
          </div>
          <button className="btn btn-outline">
            <CalendarDays size={16} />
            All Dates
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f4f7fb] text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr className="border-t" key={r[0]}>
                  {r.map((x, i) => (
                    <td className="p-4" key={i}>
                      {i === 3 ? <span className="badge">{x}</span> : x}
                    </td>
                  ))}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="grid size-8 place-items-center rounded bg-emerald-50 text-emerald-600">
                        <Check size={15} />
                      </button>
                      <button className="grid size-8 place-items-center rounded bg-red-50 text-red-600">
                        <X size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
