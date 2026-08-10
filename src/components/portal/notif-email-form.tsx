"use client";
import { useState } from "react";
import { Mail, Check, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotifEmailForm({
  initial, enabled, loginEmail,
}: { initial: string; enabled: boolean; loginEmail: string }) {
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
    if (res.ok) {
      const j = (await res.json().catch(() => ({}))) as { email?: string };
      setState("ok");
      setMsg(
        (j.email ?? email).trim()
          ? "Correo de notificación guardado."
          : "Correo eliminado. No recibirás avisos de desembolso hasta que registres uno.",
      );
    } else {
      const j = await res.json().catch(() => ({}));
      setState("error"); setMsg(j.error || "Error");
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Correo de acceso</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3">
          <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex h-11 min-w-0 items-center truncate text-sm text-muted-foreground">{loginEmail}</span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Es el correo con el que inicias sesión. Lo administra ASICORP en el ERP y no se puede cambiar
          desde aquí; cambiarlo no afecta a dónde llegan las notificaciones.
        </p>
      </div>

      <form onSubmit={save} className="space-y-4">
        <div>
          <label htmlFor="notif-email" className="mb-1.5 block text-sm font-medium text-foreground">
            Correo de notificación
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input id="notif-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@empresa.com" className="h-11 w-full bg-transparent text-sm outline-none" />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Único uso de este campo: avisarte cada vez que se genere un desembolso de tus lotes. Puede ser
            distinto al correo de acceso. Déjalo vacío para no recibir avisos.
          </p>
        </div>

        {!enabled && (
          <p className="flex items-start gap-2 rounded-lg bg-[color:var(--danger)]/10 px-3 py-2 text-sm text-[color:var(--danger)]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Las notificaciones están deshabilitadas para tu cuenta, así que aún no se enviarán aunque
              guardes un correo. Contacta a ASICORP para activarlas.</span>
          </p>
        )}

        {msg && (
          <p className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${state === "ok" ? "bg-[color:var(--success)]/10 text-[color:var(--success)]" : "bg-[color:var(--danger)]/10 text-[color:var(--danger)]"}`}>
            {state === "ok" && <Check className="h-4 w-4 shrink-0" />}{msg}
          </p>
        )}
        <Button type="submit" disabled={state === "saving"}>{state === "saving" ? "Guardando…" : "Guardar"}</Button>
      </form>
    </div>
  );
}
