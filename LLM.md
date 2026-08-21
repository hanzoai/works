# LLM.md — hanzoai/works

`hanzo.works` is the BUSINESS face of the Hanzo cloud: one static page showing
the 22 capabilities a company runs on. `hanzo.ai` sells the platform;
`hanzoskills.com` is agent-facing markdown; this is the operator's view of the
same one API.

## The invariant, and the gate that holds it

**A card on this page is a route on api.hanzo.ai.** `src/capabilities.ts` is the
only content source, and every row's `blurb` is the capability's OWN sentence —
its Go package doc, lifted by `openapi.Synopsis` into the OpenAPI tag, read back
out of `public.yaml` (the ga-only PUBLIC contract, which is a different document
from `openapi.yaml`). That provenance is the point: the copy came from the thing
that serves it, so the page cannot describe a product the fleet does not have.

To add a capability: confirm it answers, take its sentence from the served
document, add the row, add the same line to `public/llms.txt`. The gate
`llms.txt names every capability the page shows` fails if you do the first and
forget the second — which is the drift that matters here, because it is the case
where the site tells a person about something it never tells a model.

Two facts that were checked against `hanzoai/cloud` and will move again:

- **`campaign` became `campaigns` mid-build.** The house rule is that a
  collection is plural, and `manifest/apps.go` was renamed while this repo was
  being written. `/v1/campaigns` is correct now. Singular survives only where
  there is no by-id member (`framework`, `reference`, `sync`).
- **Stage gates what is public.** `public.yaml` is ga-only, so a beta capability
  is absent from it by construction. All 22 rows here were confirmed present in
  it; only `graph`, `research` and `admission` carry a non-ga stage in the
  manifest, and none of them is a business capability.

Read `public.yaml`, not the live door. `GET /v1` is a live production endpoint
and enumerating it to answer a documentation question has taken api.hanzo.ai
down before.

## Decisions worth not relitigating

**`@hanzo/tokens` is not a dependency.** `@hanzo/design` publishes the token
layer already, in `styles.css`. Loading both defines two sets of custom
properties for one design system (`--background` against `--hz-background`) with
nothing keeping them in agreement, which is the second-source-of-truth failure
this estate keeps deleting. `@hanzo/appearance` settles it independently: it
imports `Preference` from `@hanzo/design`, so design is where the token layer
lives.

**`@hanzo/appearance` does not do light/dark, and nothing pretends it does.**
Its whole scope is a person's type scale, density, face, measure and accent —
there is no `mode` on its `Preference` and no `data-theme` anywhere in it.
Light/dark is the design system's own contract: dark is `:root`, light is a
`.light` class on the root element. The one control is `applyTheme()` from
`@hanzo/iam/react`, which writes `data-theme` and the `dark` class; `setTheme`
in `components/Chrome.tsx` mirrors its ANSWER onto `.light` so the tokens flip.
One value, one key (`hanzo_iam_theme`), read by both the head script and the
control — if those ever read two keys, the page paints one theme and then jumps.

**`headers()` is not in `next.config.mjs`.** It is silently inert under
`output: export` and Next says so on every build, so a block there would read as
a security control and enforce nothing. Response headers are `public/_headers`,
which the serving layer reads.

**`trailingSlash: true` is load-bearing.** It makes the export a tree of
directory indexes, so `/auth/callback/` resolves. The flat form emits
`auth/callback.html`, which a plain file server 404s — on the OAuth return trip,
where it is hardest to notice and most expensive to debug.

**`.hanzo/workflows/`, never `.github/workflows/`.** The forge reads the first
workflow directory that exists; a `.github` one beside it is dark. And
`hanzo-build-linux-amd64` is advertised only by runners registered to
git.hanzo.ai, so the same job on github.com is never assigned and waits out a
24h timeout instead of failing.

## Auth

Hanzo IAM, and there is nothing else. `src/iam.ts` states three values — the
issuer (off `@hanzo/brand`'s record, `https://hanzo.id`), the client id
`hanzo-works` (`<org>-<app>`), and the callback path — and calls
`configureIam`. No password field, no session cookie minted here, no token
verified here. A client cannot verify its own token and pretending otherwise is
how a second, weaker auth gets built; the resource server checks the JWT.

PKCE-S256 is always on and is what lets a static export run this at all: the
verifier never leaves the browser, so there is no client secret and no server.
`e2e/site.spec.ts` proves it against the real issuer — it clicks Sign in and
asserts the outbound request reaches `hanzo.id/v1/iam/oauth/authorize` carrying
`client_id=hanzo-works`, `code_challenge_method=S256` and a real challenge.

**`@hanzo/iam` and `@hanzo/logo` ship no `"use client"` directive.**
`components/Chrome.tsx` is the one boundary that imports them; everything else
stays a Server Component and ships no JavaScript.

## Gates

Playwright, against `out/` — the bytes that ship — never a dev server. They
assert PAINT and not markup: the body's computed background is the token's
value, the theme control moves it, an unset preference follows the OS in both
directions, and the choice survives a reload (which is the head script's job,
and a miss there is the white flash it exists to prevent).

The first run of these gates failed and was right to: they asserted a dark
default, while Playwright's Desktop Chrome reports `prefers-color-scheme:
light`, so `system` had correctly resolved light. The tests now STATE the
scheme. A theme test that just loads the page is measuring the runner's
preference and calling it the site's.

## Not done yet

`hanzo.works` does not resolve. The domain is registered and delegated to
Cloudflare, and the apex has no record. In order: the `hanzo-works` IAM
application (redirect `https://hanzo.works/auth/callback`), the first deploy
(which mints the Sites-plane project), then the DNS record. None is a code
change here.
