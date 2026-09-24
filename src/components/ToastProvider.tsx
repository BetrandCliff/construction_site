"use client";
import { ReactNode, useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

type Toast = { message: string; tone: "success" | "error" };
type ToastEvent = CustomEvent<Toast>;

export function showToast(message: string, tone: Toast["tone"] = "success") {
  window.dispatchEvent(new CustomEvent<Toast>("app:toast", { detail: { message, tone } }));
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handle = (event: Event) => {
      const next = (event as ToastEvent).detail;
      setToast(next);
      clearTimeout(timeout);
      timeout = setTimeout(() => setToast(null), 4500);
    };
    window.addEventListener("app:toast", handle);
    return () => { window.removeEventListener("app:toast", handle); clearTimeout(timeout); };
  }, []);
  return <>{children}{toast&&<div role={toast.tone === "error" ? "alert" : "status"} className={`fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${toast.tone === "success" ? "bg-emerald-700" : "bg-red-700"}`}><span className="mt-0.5">{toast.tone === "success" ? <CheckCircle2 size={18}/> : <CircleAlert size={18}/>}</span><p className="flex-1">{toast.message}</p><button aria-label="Dismiss notification" onClick={()=>setToast(null)} className="rounded p-0.5 hover:bg-white/15"><X size={16}/></button></div>}</>;
}
