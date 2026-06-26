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
  legalName: "Asicorp",
  tagline: "Liquidez inmediata para el sector salud",
  description:
    "Asicorp convierte tus cuentas por cobrar a las ARS en liquidez inmediata. Factoring, facturación electrónica, contabilidad y gestión tributaria para el sector salud en República Dominicana.",
  city: "Santo Domingo, República Dominicana",
  url: "https://asicorprd.com",
  contact: {
    phone: "(809) 979-5810",
    whatsapp: "18099795810",
    email: "info@asicorprd.com",
    address: "Av. Independencia 603, Santo Domingo",
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
      { label: "Factoring de salud", href: "/servicios#factoring", description: "Liquidez por tus cuentas por cobrar" },
      { label: "Facturación electrónica", href: "/servicios#facturacion", description: "Cumple con la DGII sin complicarte" },
      { label: "Contabilidad", href: "/servicios#contabilidad", description: "Tu contabilidad al día y ordenada" },
      { label: "Gestión tributaria", href: "/servicios#tributaria", description: "Impuestos y obligaciones bajo control" },
    ],
  },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export const stats = [
  { value: 72, prefix: "", suffix: "h", label: "Liquidez máxima" },
  { value: 100, prefix: "", suffix: "%", label: "Proceso digital" },
  { value: 7, prefix: "+", suffix: "", label: "Servicios integrados" },
  { value: 15, prefix: "+", suffix: " años", label: "En finanzas y salud" },
];
