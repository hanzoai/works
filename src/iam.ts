/**
 * The login. There is exactly one, and it is Hanzo IAM.
 *
 * No password lives here, no session cookie is minted here, no token is
 * verified here. This module states three values and calls the SDK — and that
 * is the whole of what a client is allowed to know about identity.
 *
 * The flow is OIDC Authorization Code + PKCE-S256, which is the public-client
 * flow: the code verifier never leaves the browser and there is no client
 * secret to keep, so a static export can run it with no server behind it. The
 * token, userinfo and end-session endpoints are resolved from IAM's own
 * discovery document — this file names no path.
 */
import { configureIam } from '@hanzo/iam/browser'
import brand from '@hanzo/brand/brand.json'

/**
 * The issuer, read off the brand record rather than typed here. hanzo.works is
 * a Hanzo surface, so it authenticates against the Hanzo IAM the rest of the
 * estate does; a white-label of this page changes the brand, not this file.
 */
export const issuer: string = brand.iam.provider

/**
 * `<org>-<app>`, the house naming for an IAM application. The org is `hanzo`
 * and the app is `works`, so the client id is `hanzo-works` — one name, and it
 * is the same name as the repo, the site and the deploy slug.
 */
export const clientId = 'hanzo-works'

/**
 * Where IAM returns the browser. It must match the application's registered
 * redirect URI exactly. `trailingSlash: true` in next.config.mjs is what makes
 * this address resolve to a real file in the export.
 */
export const redirectPath = '/auth/callback'

let configured = false

/** Configure the IAM singleton once, on the client. Idempotent. */
export function iam() {
  if (typeof window === 'undefined') return
  if (configured) return
  configured = true
  configureIam({
    issuer,
    clientId,
    redirect: `${window.location.origin}${redirectPath}`,
    scope: 'openid profile email',
  })
}
