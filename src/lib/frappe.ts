import "server-only";

const BASE = process.env.FRAPPE_URL!;
const KEY = process.env.FRAPPE_API_KEY!;
const SECRET = process.env.FRAPPE_API_SECRET!;

function authHeader() {
  return `token ${KEY}:${SECRET}`;
}

/** Llama un método whitelisted de Frappe con la cuenta de servicio. Devuelve `message`. */
export async function frappeCall<T = unknown>(
  method: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(`${BASE}/api/method/${method}`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Frappe ${method} ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { message: T };
  return json.message;
}

/** Verifica credenciales de un cedente contra Frappe. true si son válidas. */
export async function frappeVerifyLogin(usr: string, pwd: string): Promise<boolean> {
  const res = await fetch(`${BASE}/api/method/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usr, pwd }),
    cache: "no-store",
    redirect: "manual",
  });
  return res.status === 200;
}
