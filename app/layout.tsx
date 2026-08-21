import type { Metadata } from 'next'
import { bootScript } from '@hanzo/appearance/state'
import { appCount } from '@/src/products'
import { Providers } from './providers'
import './globals.css'

const title = 'Hanzo Works'
const description = `The browser extension, Hanzo Team, the bot on your team's chat, and ${appCount} business apps — CRM, support, books, cap table, e-sign — on one login and one bill.`
const url = 'https://hanzo.works'

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: title, template: '%s — Hanzo Works' },
  description,
  applicationName: title,
  alternates: { canonical: '/' },
  openGraph: { title, description, url, siteName: title, type: 'website' },
  twitter: { card: 'summary_large_image', title, description, site: '@hanzoai' },
  // The point of this site is to BE read by machines. Say so in the one place
  // a crawler looks before robots.txt has a chance to.
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Paint the person's own type scale, density and accent BEFORE the
            stylesheet — the one thing a React component cannot do, because it
            mounts after the first paint. @hanzo/appearance owns the script; we
            only place it. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript() }} />
        {/* The same, for light/dark. The design system is dark at :root and
            flips on `.light`, so an unstyled first frame is a white flash for
            anyone who chose light. `hanzo_iam_theme` is the key
            @hanzo/iam/react's readThemeMode() reads, so this script and the
            toggle in Chrome.tsx are reading one value, not two. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('hanzo_iam_theme')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.setAttribute('data-theme',d?'dark':'light');r.classList.toggle('dark',d);r.classList.toggle('light',!d);r.style.colorScheme=d?'dark':'light'}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
