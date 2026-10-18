import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ["", "/servicios", "/nosotros", "/evaluacion", "/contacto"];
  return paginas.map((p) => ({
    url: `${siteConfig.url}${p}`,
    lastModified: new Date("2026-10-17"),
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
