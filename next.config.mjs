/** @type {import('next').NextConfig} */
//
// Plain ESM with a JSDoc type, not TypeScript — the deliberate house choice
// (hanzo.ai and hanzo.industries both state it): the config is a plain object
// and never needed the TypeScript compiler API to load it.
//
// This site is a STATIC EXPORT and must not grow a server. Login is OIDC
// Authorization Code + PKCE, a PUBLIC-client flow that completes entirely in
// the browser, so there is nothing here for a server to hold. The export ships
// to the Sites plane — POST /v1/projects/hanzo-works/deployments — which is one
// of the capabilities this page advertises.
//
// `trailingSlash: true` is not cosmetic. It makes the export a tree of
// directory indexes (`out/auth/callback/index.html`) rather than flat siblings
// (`out/auth/callback.html`), and a directory index is what a plain file server
// resolves. The flat form 404s the OAuth callback on the way back from IAM.

// Response headers are NOT here. `headers()` is silently inert under
// `output: export` — Next says so on every build — so a block here would be
// config that reads as a security control and enforces nothing. They live in
// `public/_headers`, which the serving layer reads, the same way
// docs.hanzo.ai states its.

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
}

export default nextConfig
