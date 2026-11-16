import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/landing`, changeFrequency: "monthly", priority: 1 }];
}
