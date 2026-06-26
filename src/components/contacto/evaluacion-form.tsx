"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/30";

const tiposEntidad = [
  "Médico independiente",
  "Clínica",
  "Laboratorio clínico",
  "Centro de imágenes",
  "Centro diagnóstico",
  "Hospital",
  "Empresa de salud",
  "Otro",
];

const rangosFacturacion = [
  "Menos de RD$100,000 / mes",
  "RD$100,000 – RD$500,000 / mes",
  "RD$500,000 – RD$1,000,000 / mes",
  "RD$1,000,000 – RD$3,000,000 / mes",
  "Más de RD$3,000,000 / mes",
];

export function EvaluacionForm() {
  const [enviado, setEnviado] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (enviado) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid place-items-center rounded-3xl border border-border bg-card p-10 text-center"
      >
        <div className="grid h-16 w-16 place-items-center rounded-full bg-success/15">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-foreground">
          ¡Solicitud recibida!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Gracias por tu interés. Uno de nuestros representantes te contactará a la
          brevedad para darte seguimiento a tu evaluación gratuita.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setEnviado(false)}>
          Enviar otra solicitud
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-border bg-card p-6 md:p-8">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Solicita tu evaluación gratuita
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuéntanos cuánto facturas y cómo contactarte. Es gratis y sin compromiso.
        </p>
      </div>

      <p className="pt-1 text-sm font-semibold text-foreground">Información de contacto</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nombre completo</label>
          <input required className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Tipo de entidad</label>
          <select required defaultValue="" className={inputCls}>
            <option value="" disabled>Selecciona</option>
            {tiposEntidad.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Correo electrónico</label>
          <input required type="email" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Teléfono</label>
          <input required type="tel" className={inputCls} placeholder="(809) 000-0000" />
        </div>
      </div>

      <p className="pt-2 text-sm font-semibold text-foreground">Información de facturación</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">
            ¿Cuánto facturas actualmente a las ARS?
          </label>
          <select required defaultValue="" className={inputCls}>
            <option value="" disabled>Selecciona un rango</option>
            {rangosFacturacion.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">
            Mensaje (opcional)
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
            placeholder="Cuéntanos sobre tu necesidad de liquidez"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Solicitar evaluación gratuita
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Tus datos se usan únicamente para darte seguimiento comercial.
        </p>
      </div>
    </form>
  );
}
