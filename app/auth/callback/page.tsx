'use client'

/**
 * Where IAM returns the browser.
 *
 * The whole exchange is four lines of SDK: verify the state, redeem the stashed
 * PKCE verifier against the discovered token endpoint, store the tokens, and go
 * back where the person started. Nothing is validated here — a client cannot
 * verify its own token, and pretending otherwise is how a second, weaker auth
 * gets built. The resource server checks the JWT; this page only carries it.
 */

import { useEffect, useState } from 'react'
import { completePopupSignin, handleCallback } from '@hanzo/iam/browser'
import { iam } from '@/src/iam'

export default function Callback() {
  const [failed, setFailed] = useState<string | null>(null)

  useEffect(() => {
    iam()
    // A popup sign-in completes itself and closes; only a top-level redirect
    // has anywhere to go afterwards.
    if (completePopupSignin()) return
    handleCallback()
      .then(({ redirect }) => {
        window.location.replace(redirect || '/')
      })
      .catch((e: unknown) => setFailed(e instanceof Error ? e.message : 'sign-in did not complete'))
  }, [])

  return (
    <div className="wrap" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <h1 style={{ fontSize: '1.4rem' }}>{failed ? 'Sign-in failed' : 'Signing you in…'}</h1>
      <p className="lede">
        {failed ?? 'Completing the exchange with hanzo.id.'}
      </p>
      {failed ? (
        <div className="btns">
          <a className="btn solid" href="/">
            Back to hanzo.works
          </a>
        </div>
      ) : null}
    </div>
  )
}
