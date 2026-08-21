# hanzo.works

The business face of the Hanzo cloud: the browser extension, Hanzo Team, the bot
on your team's chat, and the business apps behind them — CRM, support desk,
books, cap table, e-sign — on one login and one bill.

One page, static. No CMS, no database, no server.

## The rule this site is built on

**Every product named here serves at the address beside it.** Before a product
goes on the page, request its address and confirm it answers. No invented
products, no invented customers, no numbers we cannot show.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build        # -> out/
pnpm gates        # Playwright, against out/
```

The gates measure `out/` and need a build first. They drive a real browser and
assert what the page does — it paints on the design system, the buttons measure
as pills, the works-with bar animates, nothing spills sideways on a phone, and
every address the page sends a reader to answers.

## Stack

| | |
|---|---|
| Framework | Next.js 16 App Router, `output: 'export'` |
| UI | React 19 |
| Design | `@hanzo/design` — every colour, rule, radius and type rung |
| Mark | `@hanzo/logo` |
| Appearance | `@hanzo/appearance` — a person's type scale, density and accent |
| Theme | `@hanzo/iam` — `applyTheme`, the one light/dark control |
| Marks | `simple-icons` (CC0), inlined at build time |
| Gates | Playwright over the exported bytes |

## Layout

```
app/            layout, the page, sitemap
components/     Chrome.tsx (the one client boundary), Connects.tsx
src/            products.ts, integrations.ts
public/         robots.txt, llms.txt
e2e/            the gates and the static server they measure against
.hanzo/         cicd.yml, deploy.yml
hanzo.yml       the canonical CI config
```

`LLM.md` carries the decisions, the serving path and the traps.
