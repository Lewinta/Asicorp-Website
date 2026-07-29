import "server-only";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session-options";
import type { PortalSession } from "@/lib/portal-types";

type SessionData = Partial<PortalSession>;

export async function getSession() {
  const store = await cookies();
  return getIronSession<SessionData>(store, sessionOptions);
}

/** Devuelve la sesión del cedente o null si no está autenticado. */
export async function getCedenteSession(): Promise<PortalSession | null> {
  const s = await getSession();
  if (!s.cedente || !s.email) return null;
  return { cedente: s.cedente, customerName: s.customerName ?? "", email: s.email };
}
