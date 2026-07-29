import { redirect } from "next/navigation";
import { getCedenteSession } from "@/lib/session";
import { PortalShell } from "@/components/portal/shell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getCedenteSession();
  if (!session) redirect("/portal/login");
  return <PortalShell session={session}>{children}</PortalShell>;
}
