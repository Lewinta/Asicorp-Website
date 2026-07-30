import "server-only";
import { getCedenteSession } from "@/lib/session";
import { frappeCall } from "@/lib/frappe";
import type { LoteRow, PortalSummary, LoteDetail, PortalAnalytics, PortalResumen } from "@/lib/portal-types";

export async function fetchSummary(): Promise<PortalSummary> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<PortalSummary>("asicorp.api.get_portal_summary", { cedente: s.cedente });
}

export async function fetchLotes(estado?: string): Promise<LoteRow[]> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<LoteRow[]>("asicorp.api.get_portal_lotes", {
    cedente: s.cedente, ...(estado ? { estado } : {}),
  });
}

export async function fetchLoteDetail(lote: string): Promise<LoteDetail> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<LoteDetail>("asicorp.api.get_portal_lote_detail", {
    cedente: s.cedente, lote,
  });
}

export async function fetchNotificationEmail(): Promise<{ email: string; enabled: boolean }> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<{ email: string; enabled: boolean }>("asicorp.api.get_notification_email", { cedente: s.cedente });
}

export async function fetchAnalytics(): Promise<PortalAnalytics> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<PortalAnalytics>("asicorp.api.get_portal_analytics", { cedente: s.cedente });
}

export async function fetchResumen(): Promise<PortalResumen> {
  const s = await getCedenteSession();
  if (!s) throw new Error("no-session");
  return frappeCall<PortalResumen>("asicorp.api.get_portal_resumen", { cedente: s.cedente });
}
