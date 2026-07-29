import { NextResponse } from "next/server";
import { getCedenteSession } from "@/lib/session";
import { frappeCall } from "@/lib/frappe";

export async function POST(req: Request) {
  const s = await getCedenteSession();
  if (!s) return NextResponse.json({ error: "no-session" }, { status: 401 });
  const { email } = (await req.json()) as { email?: string };
  try {
    const r = await frappeCall<{ ok: boolean; email: string }>(
      "asicorp.api.set_notification_email", { cedente: s.cedente, email: email ?? "" },
    );
    return NextResponse.json(r);
  } catch (e) {
    const msg = (e as Error).message.toLowerCase();
    return NextResponse.json(
      { error: msg.includes("email") ? "Correo inválido" : "Error al guardar" },
      { status: 400 },
    );
  }
}
