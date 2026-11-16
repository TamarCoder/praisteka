import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

export default function robots(): MetadataRoute.Robots {
  return {
    // auth გვერდებს noindex აქვს; Disallow რომ იყოს, Google ამ noindex-ს ვერ დაინახავდა
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
