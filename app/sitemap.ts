import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

/** Two routes, both real. A sitemap that names a page nobody serves is worse
 *  than none: it teaches a crawler to distrust the rest of the file. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: 'https://hanzo.works/', lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ]
}
