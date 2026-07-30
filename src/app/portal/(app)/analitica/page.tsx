import { fetchAnalytics } from "@/lib/portal-data";
import { AnaliticaKpis } from "@/components/portal/analitica/analitica-kpis";
import { ArsTable } from "@/components/portal/analitica/ars-table";
import { EvolucionChart } from "@/components/portal/analitica/evolucion-chart";
import { GlosaFocus } from "@/components/portal/analitica/glosa-focus";

export const dynamic = "force-dynamic";

export default async function AnaliticaPage() {
  const a = await fetchAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Analítica</h1>
        <p className="text-sm text-muted-foreground">Tu operación de factoring con ASICORP.</p>
      </div>

      {a.totales.n_facturas === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Aquí verás tu analítica —facturación, liquidez, cobranza y glosas— en cuanto tengas tu primer lote desembolsado.
        </p>
      ) : (
        <>
          <AnaliticaKpis t={a.totales} />

          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <div className="space-y-3">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Desempeño por ARS</h2>
                <p className="text-sm text-muted-foreground">
                  Dónde facturas, cuánto recibiste y cómo va la cobranza de cada aseguradora.
                </p>
              </div>
              <ArsTable rows={a.por_ars} />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-bold text-foreground">Evolución mensual</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Facturado vs. liquidez desembolsada, mes a mes.
              </p>
              <EvolucionChart rows={a.mensual} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold text-foreground">Foco de glosas</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Lo que las ARS te rechazan. Aquí es donde puedes recuperar dinero reclamando.
            </p>
            <GlosaFocus glosas={a.glosas} facturado={a.totales.facturado} />
          </div>
        </>
      )}
    </div>
  );
}
