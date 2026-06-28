import Link from "next/link";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/brand/logo";

const servicios = [
  { label: "Factoring de salud", href: "/servicios#factoring" },
  { label: "Facturación electrónica", href: "/servicios#facturacion" },
  { label: "Contabilidad", href: "/servicios#contabilidad" },
  { label: "Gestión tributaria", href: "/servicios#tributaria" },
];

const empresa = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "¿A quién ayudamos?", href: "/#sectores" },
  { label: "Contacto", href: "/contacto" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-card">
      <div className="container-page mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Convertimos tus cuentas por cobrar a las ARS en liquidez inmediata.
            Aliado financiero integral del sector salud en {siteConfig.city}.
          </p>
          <Link
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
          >
            <Globe className="h-4 w-4" /> LinkedIn
          </Link>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Servicios</h4>
          <ul className="mt-4 space-y-2.5">
            {servicios.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Empresa</h4>
          <ul className="mt-4 space-y-2.5">
            {empresa.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Contacto</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{siteConfig.contact.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <span>{siteConfig.contact.phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <span>{siteConfig.contact.email}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{siteConfig.contact.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.</p>
          <p>Soluciones financieras para el sector salud</p>
        </div>
      </div>
    </footer>
  );
}
