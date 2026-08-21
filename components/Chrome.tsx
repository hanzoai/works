'use client'

/**
 * The nav: the mark, who you are, and what the page is set in.
 *
 * This module is the client boundary. `@hanzo/iam` and `@hanzo/logo` ship no
 * `"use client"` directive of their own, so importing them from a Server
 * Component fails — one barrel here is the whole fix, and it is why the rest
 * of the page can stay a Server Component that ships no JavaScript.
 */

import { useCallback, useEffect, useState } from 'react'
import { HanzoLogo } from '@hanzo/logo/react'
import { getSession, getUser, logout, startLogin } from '@hanzo/iam/browser'
import { applyTheme, readThemeMode, type ThemeMode } from '@hanzo/iam/react'
import { iam } from '@/src/iam'

/**
 * The design system is dark at `:root` and flips on `.light`;
 * `applyTheme` writes `data-theme` and the `dark` class Tailwind keys off.
 * One control, so the two conventions cannot disagree — this mirrors its
 * ANSWER onto the class the tokens actually read.
 */
function setTheme(mode: ThemeMode) {
  const resolved = applyTheme(mode)
  document.documentElement.classList.toggle('light', resolved === 'light')
}

const NEXT: Record<ThemeMode, ThemeMode> = { system: 'light', light: 'dark', dark: 'system' }

export function Chrome() {
  const [mode, setMode] = useState<ThemeMode>('system')
  const [who, setWho] = useState<string | null>(null)

  useEffect(() => {
    iam()
    setMode(readThemeMode())
    if (!getSession().authenticated) return
    getUser()
      .then((u) => setWho(u?.name || u?.email || 'signed in'))
      .catch(() => setWho(null))
  }, [])

  const cycle = useCallback(() => {
    setMode((m) => {
      const next = NEXT[m]
      setTheme(next)
      try {
        localStorage.setItem('hanzo_iam_theme', next)
      } catch {
        /* a browser that refuses storage still gets the theme it asked for */
      }
      return next
    })
  }, [])

  return (
    <nav>
      <div className="in">
        <a className="brand" href="/">
          {/* The interactive mark: origami fold-in on load, a turn on hover, a
              press on active — pure CSS, reduced-motion-safe, inheriting
              currentColor so it flips with the theme.
              `variant="animated"` and NOT the `animated` motion shell: the
              shell brings its own wordmark that slides in and collapses, and
              the lockup beside it is already the wordmark. Two of them means
              the nav says the brand twice and reflows on hover. */}
          <HanzoLogo variant="animated" size={20} />
          <span>
            HANZO<i>WORKS</i>
          </span>
        </a>
        <div className="navlinks">
          <button className="navlink" onClick={cycle} title={`Theme: ${mode}`} type="button">
            {mode}
          </button>
          <a className="navlink" href="https://hanzo.ai">
            hanzo.ai
          </a>
          {who ? (
            <button className="navlink" onClick={() => void logout()} type="button">
              Sign out
            </button>
          ) : (
            <button className="navlink" onClick={() => void startLogin()} type="button">
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
