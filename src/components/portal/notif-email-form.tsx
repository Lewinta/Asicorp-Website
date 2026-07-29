"use client";
import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotifEmailForm({ initial }: { initial: string }) {
  const [email, setEmail] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("saving"); setMsg("");
    const res = await fetch("/api/portal/notificacion", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) { setState("ok"); setMsg("Correo guardado."); }
    else { const j = await res.json().catch(() => ({})); setState("error"); setMsg(j.error || "Error"); }
  }

  return (
    <form onSubmit={save} className="max-w-md space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Correo de notificación</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@empresa.com" className="h-11 w-full bg-transparent text-sm outline-none" />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">Te avisaremos aquí cada vez que se genere un desembolso de tus lotes.</p>
      </div>
      {msg && (
        <p className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${state === "ok" ? "bg-[color:var(--success)]/10 text-[color:var(--success)]" : "bg-[color:var(--danger)]/10 text-[color:var(--danger)]"}`}>
          {state === "ok" && <Check className="h-4 w-4" />}{msg}
        </p>
      )}
      <Button type="submit" disabled={state === "saving"}>{state === "saving" ? "Guardando…" : "Guardar"}</Button>
    </form>
  );
}
