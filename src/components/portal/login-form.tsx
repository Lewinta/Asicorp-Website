"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/portal/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) { router.replace("/portal"); router.refresh(); }
    else { const j = await res.json().catch(() => ({})); setError(j.error || "Error al iniciar sesión"); }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Correo</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="cedente@empresa.com" autoComplete="username"
            className="h-11 w-full bg-transparent text-sm outline-none" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Contraseña</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password"
            className="h-11 w-full bg-transparent text-sm outline-none" />
          <button type="button" onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {error && <p className="rounded-lg bg-[color:var(--danger)]/10 px-3 py-2 text-sm text-[color:var(--danger)]">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Ingresando…" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
