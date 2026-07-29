import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/portal/login-form";

export default function PortalLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--brand-blue-bright)_0%,transparent_65%)] opacity-40 blur-2xl" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex">
            <span className="rounded-2xl bg-white/95 px-3 py-2"><Logo /></span>
          </Link>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight text-white">
              Tu liquidez, <br /> siempre a la vista.
            </h1>
            <p className="mt-4 max-w-sm text-white/80">
              Consulta tus lotes, desembolsos y estados de cuenta en un solo lugar.
            </p>
          </div>
          <p className="text-sm text-white/60">ASICORP · Factoring para el sector salud</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <h2 className="font-display text-2xl font-bold text-foreground">Acceso al Portal del Cedente</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ingresa con el correo que registraste con ASICORP.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
