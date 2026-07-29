import { NextResponse } from "next/server";
import { frappeVerifyLogin, frappeCall } from "@/lib/frappe";
import { getSession } from "@/lib/session";
import type { PortalSession } from "@/lib/portal-types";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
  }
  const ok = await frappeVerifyLogin(email, password);
  if (!ok) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }
  let profile: PortalSession;
  try {
    profile = await frappeCall<PortalSession>("asicorp.api.get_portal_profile", { email });
  } catch {
    return NextResponse.json(
      { error: "Tu usuario no está asociado a un cedente. Contacta a ASICORP." },
      { status: 403 },
    );
  }
  const session = await getSession();
  session.cedente = profile.cedente;
  session.customerName = profile.customerName;
  session.email = profile.email;
  await session.save();
  return NextResponse.json({ ok: true });
}
