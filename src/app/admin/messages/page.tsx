"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail, Send, X } from "lucide-react";
import { showToast } from "@/components/ToastProvider";

type Message = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  project_type?: string;
  created_at: string;
  message: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/messages")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setMessages(data);
      })
      .catch((reason) => setError(reason.message));
  }, []);

  async function sendReply(event: FormEvent<HTMLFormElement>, message: Message) {
    event.preventDefault();
    setSending(true);
    try {
      const response = await fetch(`/api/messages/${message.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not send reply.");
      showToast(`Reply sent to ${message.email}.`);
      setReply("");
      setReplyTo(null);
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Could not send reply.", "error");
    } finally {
      setSending(false);
    }
  }

  return <div>
    <p className="text-sm text-slate-500">Visitor enquiries</p>
    <h1 className="text-3xl font-black">Messages</h1>
    {error && <p role="alert" className="mt-5 text-sm text-red-600">{error}</p>}
    <div className="mt-8 grid gap-4">
      {messages.map((message) => <article className="card p-6" key={message.id}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-black">{message.subject || message.project_type || "Website enquiry"}</h2>
            <p className="mt-1 text-sm text-slate-500">{message.name} · {new Date(message.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a className="inline-flex items-center gap-2 text-sm font-bold text-[#147ee8] hover:underline" href={`mailto:${encodeURIComponent(message.email)}`}><Mail size={15}/>{message.email}</a>
            <button type="button" aria-expanded={replyTo === message.id} onClick={() => { setReplyTo(replyTo === message.id ? null : message.id); setReply(""); }} className="text-sm font-bold text-[#147ee8] hover:underline">
              {replyTo === message.id ? "Close reply" : "Reply"}
            </button>
          </div>
        </div>
        <p className="mt-4 leading-7 text-slate-600">{message.message}</p>
        {replyTo === message.id && <form onSubmit={(event) => sendReply(event, message)} className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-bold">Reply to {message.name}</p><p className="mt-1 text-xs text-slate-500">To: {message.email} · Subject: Re: {message.subject || message.project_type || "Website enquiry"}</p></div>
            <button type="button" aria-label="Close reply form" onClick={() => setReplyTo(null)} className="rounded p-1 text-slate-500 hover:bg-slate-200"><X size={18}/></button>
          </div>
          <textarea required rows={5} value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Write a message to ${message.name}…`} className="input mt-4 min-h-32 w-full" />
          <button disabled={sending || !reply.trim()} className="btn btn-primary mt-3"><Send size={16}/>{sending ? "Sending…" : "Send reply"}</button>
        </form>}
      </article>)}
      {!messages.length && !error && <p className="text-sm text-slate-500">No messages received yet.</p>}
    </div>
  </div>;
}
