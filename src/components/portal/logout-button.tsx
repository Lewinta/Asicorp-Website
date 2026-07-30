"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();
  async function onLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.replace("/portal/login");
  }
  return (
    <button onClick={onLogout}
      title={collapsed ? "Cerrar sesión" : undefined}
      className={`mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color:var(--danger)]/10 hover:text-[color:var(--danger)] ${collapsed ? "justify-center" : ""}`}>
      <LogOut className="h-[18px] w-[18px] shrink-0" /> {!collapsed && "Cerrar sesión"}
    </button>
  );
}
