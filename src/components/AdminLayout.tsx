"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Box,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const links = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Projects", "/admin/projects", FolderKanban],
  ["3D Designs", "/admin/3d-designs", Box],
  ["Appointments", "/admin/appointments", CalendarDays],
  ["Messages", "/admin/messages", Users],
  ["Documents", "/admin/documents", FolderKanban],
  ["Settings", "/admin/settings", Settings],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(window.localStorage.getItem("admin-sidebar-collapsed") === "true");
  }, []);
  useEffect(() => {
    window.localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);
  if (pathname === "/admin/login" || pathname === "/admin/forgot-password") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="flex min-h-screen">
        <aside className={`${collapsed ? "w-[76px]" : "w-64"} shrink-0 bg-[#081a2c] p-3 text-white transition-[width] duration-200 sm:p-5`}>
          <div className={`mb-6 flex items-center ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
            {!collapsed && <div className="text-lg font-black">Build<span className="text-[#55a9ff]">Vision</span> Admin</div>}
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
              title={collapsed ? "Expand sidebar" : "Minimize sidebar"}
              onClick={() => setCollapsed((value) => !value)}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
            >
              {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            </button>
          </div>
          <nav aria-label="Admin navigation" className="grid gap-2">
            {links.map(([title, href, Icon]) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link href={href} key={href} title={collapsed ? title : undefined} aria-label={title}
                  className={`flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-3"} rounded-lg py-3 text-sm font-bold transition-colors hover:bg-white/10 hover:text-white ${active ? "bg-white/10 text-white" : "text-slate-300"}`}>
                  <Icon size={18} />
                  {!collapsed && <span>{title}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-white/10 pt-5">
            <Link href="/" title={collapsed ? "Back to website" : undefined} aria-label="Back to website"
              className={`flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-3"} py-2 text-sm text-slate-400 hover:text-white`}>
              <LogOut size={18} />
              {!collapsed && <span>Back to website</span>}
            </Link>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <span className="font-bold text-slate-700">Administration</span>
            <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.assign("/admin/login"); }} className="text-sm font-bold text-slate-500">Sign out</button>
          </header>
          <main className="p-5 md:p-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
