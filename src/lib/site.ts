/*
  Configuración central del sitio ASICORP.
  Valores con {{PLACEHOLDER}} deben confirmarse con la empresa (ver README).
*/

export const PLACEHOLDER = {
  phone: "{{TELEFONO}}",
  whatsapp: "{{WHATSAPP}}",
  email: "{{EMAIL}}",
  address: "{{DIRECCION}}",
  rnc: "{{RNC}}",
  hours: "{{HORARIO}}",
} as const;

export const siteConfig = {
  name: "ASICORP",
  legalName: "Asesores e Interventores Corporativos, S.R.L.",
  tagline: "Liquidez inmediata para el sector salud",
  description:
    "ASICORP anticipa en 4 días hábiles el total facturado a las ARS por clínicas, centros de diagnóstico, laboratorios y profesionales de la salud en República Dominicana. Auditoría forense, radicación, anticipo y cobranza, sin préstamos, garantías ni avales.",
  city: "Santo Domingo, República Dominicana",
  url: "https://asicorprd.com",
  contact: {
    phone: "(809) 769-5810",
    whatsapp: "18097695810",
    email: "info@asicorprd.com",
    address: "Av. Independencia 603, suite B3-B4, Santo Domingo, D.N.",
    hours: "Lunes a Viernes, 8:00 AM a 5:00 PM",
  },
  social: {
    instagram: "{{INSTAGRAM}}",
    linkedin: "{{LINKEDIN}}",
    facebook: "{{FACEBOOK}}",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Servicios",
    href: "/servicios",
    children: [
      { label: "Cesión de crédito", href: "/servicios#cesion", description: "Auditoría, radicación, anticipo y cobranza" },
      { label: "Servicios complementarios", href: "/servicios#complementarios", description: "Costos, negociación tarifaria y auditoría médica" },
      { label: "Inversión", href: "/servicios#inversion", description: "Tarifa publicada y qué incluye" },
    ],
  },
  { label: "Cómo funciona", href: "/#ciclo" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

/** Enlace de WhatsApp con mensaje prellenado. */
export function whatsappUrl(mensaje: string) {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
