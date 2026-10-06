import type { MetadataRoute } from "next";

import { betrieb } from "@/data/betrieb";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${betrieb.url}/sitemap.xml`,
  };
}
