# hanzo.works

The business face of the Hanzo cloud: the apps a company actually runs on —
sales, marketing, support, books, cap table, incorporation, workflows — shown as
what they are, capabilities on one API.

It is a one-page marketing site. There is no CMS, no database and no server.

## The rule this site is built on

**Every claim maps to a served address.** Each card names a real capability and
its real `/v1` route, and its sentence is the capability's OWN published
description — the doc comment on its Go package, lifted into the OpenAPI tag and
read back out of `public.yaml`, the ga-only public contract. Nothing on the page
was written by a marketer about a product that does not answer.

If a capability is not in `https://api.hanzo.ai/v1/openapi.json`, it does not go
on the page.

## Stack

| | |
|---|---|
| Framework | Next.js 16 App Router, `output: 'export'` — a static site |
| UI | React 19 |
| Package manager | pnpm (`packageManager` in package.json is the one pin) |
| Design | `@hanzo/design` — every colour, rule, radius and type rung is one of its tokens |
| Mark | `@hanzo/logo` — the animated Hanzo mark |
| Brand | `@hanzo/brand` — the identity record, including the IAM issuer |
| Appearance | `@hanzo/appearance` — a person's own type scale, density and accent |
| Login | `@hanzo/iam` — Hanzo IAM at `hanzo.id`, OIDC Authorization Code + PKCE |
| Gates | Playwright, driving a real browser over the exported bytes |

`@hanzo/tokens` is deliberately **not** a dependency. `@hanzo/design` already
publishes the token layer, and loading both would define two sets of CSS custom
properties for one design system — `--background` in one file and
`--hz-background` in the other, with nothing keeping them in agreement.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build        # -> out/
pnpm gates        # Playwright, against out/
```

The gates need a build first — they measure `out/`, never a dev server, because
the two things worth checking are invisible upstream of the export: whether the
page actually paints on the design system, and whether `llms.txt` still names
every capability the page shows.

## Deploy

It ships to the **Sites plane** — `/v1/projects`, one of the capabilities it
advertises. A site is not an App: no container image, no App CR, no replicas, no
operator reconcile.

```
pnpm build -> out/
  -> POST /v1/projects/hanzo-works/deployments      202, an upload grant
  -> POST the objects straight to S3                the bytes skip the API
  -> POST .../deployments/<id>/complete             live
```

`.hanzo/workflows/deploy.yml` runs it on a push to `main` via
`hanzoai/ci`'s `site@v1` action, which self-provisions the project the first
time. The one credential is `KMS_CLIENT_ID` / `KMS_CLIENT_SECRET`; the upload
grant is prefix-scoped and expires in 30 minutes, so nothing here holds a bucket
key.

CI lives in `.hanzo/workflows/`, **not** `.github/workflows/`. The runner label
`hanzo-build-linux-amd64` is advertised only by runners registered to
git.hanzo.ai, and the forge reads the first workflow directory that exists — a
`.github/workflows` beside this one would be dark config, and the same job on
github.com would wait out its 24h timeout rather than fail.

### What is not done yet

**`hanzo.works` does not resolve.** The domain is registered and its zone is
delegated to Cloudflare (`hattie`/`quinton.ns.cloudflare.com`), but the apex has
no `A`/`AAAA`/`CNAME` record, so the site is not reachable at that name yet.
Standing it up needs, in order:

1. **An IAM application** `hanzo-works` (`<org>-<app>`, org `hanzo`) with
   redirect URI `https://hanzo.works/auth/callback`. Until it exists, sign-in
   reaches `hanzo.id` and is refused there.
2. **The first deploy**, which mints the `hanzo-works` project on the Sites
   plane and gives it a `*.hanzo.app` origin.
3. **The DNS record** in the existing Cloudflare zone, pointing the apex at that
   origin.

None of the three is a code change in this repo.

## Layout

```
app/            layout, the page, the OAuth callback, sitemap
components/     Chrome.tsx — the one "use client" boundary
src/            capabilities.ts (the data), iam.ts (the login config)
public/         robots.txt, llms.txt, _headers, CNAME
e2e/            the gates and the static server they measure against
.hanzo/         cicd.yml, deploy.yml
hanzo.yml       the canonical CI config
```

## Machines are welcome

`robots.txt` names the AI crawlers and allows them — GPTBot, ClaudeBot, CCBot,
Google-Extended, PerplexityBot, Applebot-Extended and the rest — and declares
`Content-Signal: search=yes, ai-input=yes, ai-train=yes`. There is not one
`Disallow` in it, and a gate fails the build if one appears without a reason.

`llms.txt` is the machine-readable index of this site and points at
`hanzoskills.com/llms.txt` for the deep corpus.
