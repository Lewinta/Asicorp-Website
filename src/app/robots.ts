import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Se permiten buscadores y bots de IA; el portal de cedentes queda fuera.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/portal", "/api"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
