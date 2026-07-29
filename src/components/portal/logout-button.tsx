"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function onLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.replace("/portal/login");
  }
  return (
    <button onClick={onLogout}
      className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color:var(--danger)]/10 hover:text-[color:var(--danger)]">
      <LogOut className="h-[18px] w-[18px]" /> Cerrar sesión
    </button>
  );
}
