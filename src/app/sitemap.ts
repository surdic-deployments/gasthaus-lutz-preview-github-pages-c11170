import type { MetadataRoute } from "next";

import { betrieb } from "@/data/betrieb";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${betrieb.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${betrieb.url}/impressum`, priority: 0.2 },
    { url: `${betrieb.url}/datenschutz`, priority: 0.2 },
  ];
}
