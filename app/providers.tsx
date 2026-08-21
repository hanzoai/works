'use client'

/**
 * Telemetry, through the ONE client.
 *
 * `@hanzo/event` posts to api.hanzo.ai/v1/event and that is the only collector
 * this site has. No second script, no vendor tag, no pixel.
 *
 * This site BUILDS, so it takes the package rather than the door's hosted tag
 * (`/v1/event/tag.js`) — that tag is the same wire for a page with no bundler,
 * and a page carrying both counts every pageview twice. It also keeps the CSP
 * untouched: the client only ever POSTs, so `connect-src`, which already names
 * api.hanzo.ai, is the only directive involved.
 *
 * `autoPageview` counts the initial load. A one-page export has no route change
 * to follow, so there is no usePageview() call — it would double-count.
 */

import { AnalyticsProvider, ErrorBoundary } from '@hanzo/event/react'

/**
 * No key is stated here, and that is the fix rather than the gap.
 *
 * A domain belongs to exactly one brand, so `@hanzo/event` derives the
 * publishable key from the hostname (`orgOf`/`keyFor`, src/org.ts) and
 * `hanzo.works` is in that table. A key pasted here would restate something the
 * page already knows, and the fleet has paid for that twice: once when one
 * build-time key filed every brand's visitors under Hanzo, and once when each
 * site committed its own literal and a new site reported nothing until somebody
 * remembered. `NEXT_PUBLIC_PUBLISHABLE_KEY` still wins if a lane sets one.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider config={{ product: 'works' }}>
      {/* React swallows render errors before window.onerror sees them, so the
          boundary is the only way they are ever reported. It renders its
          children unchanged when nothing throws. */}
      <ErrorBoundary>{children}</ErrorBoundary>
    </AnalyticsProvider>
  )
}
