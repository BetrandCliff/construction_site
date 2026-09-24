"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Box,
  CalendarDays,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    ["Dashboard", "/admin", LayoutDashboard],
    ["Projects", "/admin/projects", FolderKanban],
    ["3D Designs", "/admin/3d-designs", Box],
    ["Appointments", "/admin/appointments", CalendarDays],
    ["Customers", "#", Users],
    ["Settings", "#", Settings],
  ];
  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f4f7fb]">
      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className="hidden w-64 shrink-0 bg-[#081a2c] p-5 text-white md:block">
          <div className="mb-8 text-lg font-black">
            Build<span className="text-[#55a9ff]">Vision</span> Admin
          </div>
          <div className="grid gap-2">
            {links.map(([t, h, I]: any) => (
              <Link
                href={h}
                key={t}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <I size={17} />
                {t}
              </Link>
            ))}
          </div>
          <div className="mt-10 border-t border-white/10 pt-5">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 text-sm text-slate-400"
            >
              <LogOut size={17} />
              Back to website
            </Link>
          </div>
        </aside>
        <div className="flex-1 p-5 md:p-9">{children}</div>
      </div>
    </div>
  );
}
