# LLM.md — hanzoai/works

`hanzo.works` is the business face of Hanzo: the products a company installs and
uses. `hanzo.ai` sells the platform, `hanzoskills.com` is agent-facing markdown,
this is what a business buys and opens.

## Content model

Two data files are the only content source.

`src/products.ts` holds what the page shows. `sections` are the products a
company installs or opens — each with the address that serves it. `rows` are the
business apps, grouped by what they are for. **A product goes in when it is
running.** Verify with a request before adding one: if the address does not
answer, it does not go on the page.

`src/integrations.ts` holds the works-with bar. Every entry is a connector that
ships in `hanzoai/extension` `packages/`, or a channel Hanzo Bot answers on.
Marks come from `simple-icons` (CC0) and are inlined at build time, so the
export carries the ~19 paths it draws and the library stays out of the bundle.

Some tools we connect have no freely licensed mark — Salesforce, Slack,
Microsoft Teams, Outlook, Office, DocuSign, Canva, Workday. They are named in
`alsoConnects` and not drawn. Do not source those marks elsewhere; the reason
they are absent from simple-icons is the reason we do not draw them.

Adding a product means adding it to `src/products.ts` **and** `public/llms.txt`.
The gate `llms.txt names every product the page shows` fails otherwise, which is
the drift that matters: the page telling a person about something it never tells
a model.

## Design

Radii are the same tokens hanzo.ai renders: buttons are `--radius-full`, cards
are `--radius-2xl`. A gate measures the computed `border-radius` rather than the
class, because a square button is the defect and a class name cannot show it.

The palette, type ramp and hairlines are `@hanzo/design` tokens. Nothing here
invents a value.

**`@hanzo/tokens` is not a dependency.** `@hanzo/design` publishes the token
layer in `styles.css`. Loading both defines two sets of custom properties for
one design system (`--background` against `--hz-background`) with nothing
keeping them in agreement.

**`@hanzo/appearance` does not do light/dark.** Its scope is a person's type
scale, density, face, measure and accent. Light/dark is the design system's own
contract: dark is `:root`, light is `.light` on the root element. `applyTheme()`
from `@hanzo/iam/react` is the one control; `setTheme` in `components/Chrome.tsx`
mirrors its answer onto `.light`. One value, one key (`hanzo_iam_theme`), read
by both the head script and the control.

**`@hanzo/iam` and `@hanzo/logo` ship no `"use client"` directive.**
`components/Chrome.tsx` is the one boundary that imports them; everything else
stays a Server Component and ships no JavaScript.

## Auth

Hanzo IAM, and there is nothing else. `src/iam.ts` states the issuer (off
`@hanzo/brand`), the client id `hanzo-works` (`<org>-<app>`) and the callback
path, then calls `configureIam`. No password field, no session minted here, no
token verified here.

PKCE-S256 is what lets a static export run this: the verifier never leaves the
browser, so there is no client secret and no server. A gate proves it against
the real issuer.

## Config

**`headers()` is not in `next.config.mjs`.** It is inert under `output: export`,
so a block there would read as a security control and enforce nothing. Response
headers belong in a `headers` middleware in front of the static one on the
serving side — `public/_headers` is not read by `hanzoai/ingress`.

**`trailingSlash: true` is load-bearing.** It makes the export a tree of
directory indexes, so `/auth/callback/` resolves. The flat form emits
`auth/callback.html`, which a plain file server 404s on the OAuth return trip.

**`.hanzo/workflows/`, never `.github/workflows/`.** The forge reads the first
workflow directory that exists. `hanzo-build-linux-amd64` is advertised only by
runners registered to git.hanzo.ai, so the same job on github.com is never
assigned and waits out a 24h timeout instead of failing.

## Gates

Playwright against `out/` — the bytes that ship, never a dev server. They assert
paint and measurement, not markup: the body's computed background is the token's
value, buttons measure as pills, the marquee is wider than its window and
animating, the page does not scroll sideways at 390.

`every host this page sends a reader to answers` walks the real network. It is
meant to fail when a product goes down.

Theme tests STATE the colour scheme. Playwright's Desktop Chrome reports
`prefers-color-scheme: light`, so a test that just loads the page measures the
runner's preference and calls it the site's.

## Serving

The site is bytes in S3 read by `hanzoai/ingress`, not an App. No image, no CR,
no replicas.

| Piece | Where |
|---|---|
| Publish | `.hanzo/workflows/deploy.yml` → `hanzoai/ci` `site@v1` → `s3://hanzo-sites/hanzo/hanzo-works` |
| Route | `universe` `charts/app/values/hanzo/static-sites.yaml` — middleware + route, auto-syncs |
| Cert | `universe` `infra/k8s/ingress/wildcard-certs.yaml` — `wildcard-hanzo-works`, auto-syncs |
| DNS | reconciled from the route — see below |

`spaMode: false`. The export is `trailingSlash: true` directory indexes with a
real file per route; an SPA fallback would answer 200 with the homepage for
every missing chunk.

**Do not write a `infra/cf-zones/hanzo-works.yaml`.** The `cloud` binary reads
`CLOUDFLARE_API_KEY`/`CLOUDFLARE_EMAIL` from KMS on a loop and reconciles
Cloudflare records from the IngressRoute — apex and `www` A records for this
host appeared on their own once the route synced, proxied, pointed at
`hanzo/ingress-lb`. A zone file would be a second owner of records something
else already writes. The four zone files that do exist predate this.

Response headers are the `hanzo-works-headers` middleware on that route, and
they have to be: `staticFiles` reads objects out of S3 and never a `_headers`
file, so a header the site wants is a middleware or it does not exist. The CSP
is enforcing and names `hanzo.id` and `api.hanzo.ai` because those are the only
origins the page reaches.

Read the ingress LB address live rather than from a file — DigitalOcean recycles
released IPs:

```
kubectl -n hanzo get svc ingress-lb -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

**The repo is on github.com only.** `git.hanzo.ai/hanzoai/works` does not exist,
and the forge is where CI runs, so `.hanzo/workflows/` is dark until the forge
repo is created and set as the push target. Until then a deploy is manual:
build, then sync `out/` to the S3 prefix.
