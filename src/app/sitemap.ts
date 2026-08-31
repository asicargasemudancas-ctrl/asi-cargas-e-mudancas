import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/site-content";
import { INDEXABLE_ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
  }));
}
