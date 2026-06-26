"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/70 glass py-2"
          : "border-b border-transparent bg-transparent py-4",
      )}
    >
      <nav className="container-page mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="ASICORP inicio">
          <Logo compact={scrolled} />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            if (item.children) {
              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
                      active && "text-primary",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
                      >
                        <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-soft">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                            >
                              <span className="block text-sm font-semibold text-foreground">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="block text-xs text-muted-foreground">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
                    active && "text-primary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Cambiar tema"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-muted"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Button href="/evaluacion" size="sm" className="hidden sm:inline-flex">
            Evaluación gratuita
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="container-page mx-auto max-w-7xl px-5 pb-6 pt-2">
              <ul className="flex flex-col gap-1">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="ml-3 border-l border-border pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Button href="/evaluacion" className="w-full">
                  Evaluación gratuita
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
