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
import { usePathname } from "next/navigation";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/admin/login" || pathname === "/admin/forgot-password") return <>{children}</>;
  const links = [
    ["Dashboard", "/admin", LayoutDashboard],
    ["Projects", "/admin/projects", FolderKanban],
    ["3D Designs", "/admin/3d-designs", Box],
    ["Appointments", "/admin/appointments", CalendarDays],
    ["Messages", "/admin/messages", Users],
    ["Documents", "/admin/documents", FolderKanban],
    ["Settings", "/admin/settings", Settings],
  ];
  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 bg-[#081a2c] p-5 text-white">
          <div className="mb-8 text-lg font-black">
            Build<span className="text-[#55a9ff]">Vision</span> Admin
          </div>
          <div className="grid gap-2">
            {links.map(([t, h, I]: any) => (
              <Link
                href={h}
                key={t}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold hover:bg-white/10 hover:text-white ${pathname===h?'bg-white/10 text-white':'text-slate-300'}`}
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
        <div className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b bg-white px-6"><span className="font-bold text-slate-700">Administration</span><Link href="/admin/login" className="text-sm font-bold text-slate-500">Sign out</Link></header>
          <main className="p-5 md:p-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
