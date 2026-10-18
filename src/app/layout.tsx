import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { entidad } from "@/lib/contenido";
import { Providers } from "@/components/providers";
import { SiteChrome } from "@/components/layout/site-chrome";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "factoring médico República Dominicana",
    "anticipo de facturas ARS",
    "cesión de crédito ARS",
    "liquidez clínicas Santo Domingo",
    "auditoría de reclamaciones médicas",
    "radicación ARS",
    "glosas ARS",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

// Ficha de la empresa para Google y motores de respuesta.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "ASICORP",
  legalName: siteConfig.legalName,
  description: entidad,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/logo-nobg.png`,
  image: `${siteConfig.url}/brand/oficina-asicorp.webp`,
  telephone: "+1-809-769-5810",
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Independencia 603, suite B3-B4",
    addressLocality: "Santo Domingo",
    addressRegion: "Distrito Nacional",
    addressCountry: "DO",
  },
  areaServed: { "@type": "Country", name: "República Dominicana" },
  openingHours: "Mo-Fr 08:00-17:00",
  knowsAbout: ["Cesión de crédito", "Factoring médico", "Auditoría de reclamaciones médicas", "ARS", "Sistema Dominicano de Seguridad Social"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${sans.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
