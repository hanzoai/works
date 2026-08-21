import { test, expect } from '@playwright/test'
import { groups, count } from '../src/capabilities'

const all = groups.flatMap((g) => g.items)

/** The two grounds the design system paints, as the browser reports them. */
const DARK = 'rgb(10, 10, 10)' //  :root  --background
const LIGHT = 'rgb(247, 247, 247)' // .light --background

test.describe('the page a person sees', () => {
  // State the scheme rather than inheriting it. Playwright's Desktop Chrome
  // reports `prefers-color-scheme: light`, so a test that just loads the page
  // is measuring the RUNNER's preference and calling it the site's default.
  test.use({ colorScheme: 'dark' })

  test('the hero renders, and it renders on the design system', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Everything a company')

    // Not "is the class there" — is the page actually PAINTED in the system's
    // colours. A missing @hanzo/design import leaves a transparent body and a
    // browser default font, and both of those are visible here and nowhere
    // else in the toolchain.
    const painted = await page.evaluate(() => {
      const s = getComputedStyle(document.body)
      return { bg: s.backgroundColor, color: s.color, font: s.fontFamily }
    })
    expect(painted.bg).toBe(DARK)
    expect(painted.color).toBe('rgb(229, 229, 229)') // --foreground
    expect(painted.font).toContain('Geist') // the system's own face, self-hosted
  })

  test('an unset preference follows the operating system, both ways', async ({ browser }) => {
    // `system` is the default and it has to mean something. This is the half a
    // class assertion cannot see: two browsers, one build, two grounds.
    for (const [scheme, ground] of [
      ['dark', DARK],
      ['light', LIGHT],
    ] as const) {
      const ctx = await browser.newContext({ colorScheme: scheme })
      const p = await ctx.newPage()
      await p.goto('/')
      expect(await p.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(ground)
      await ctx.close()
    }
  })

  test('the animated mark is present and has real size', async ({ page }) => {
    await page.goto('/')
    const mark = page.locator('nav svg').first()
    await expect(mark).toBeVisible()
    const box = await mark.boundingBox()
    expect(box!.width).toBeGreaterThan(8)
    expect(box!.height).toBeGreaterThan(8)
  })

  test('every capability is on the page, with its real address', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.card')).toHaveCount(count)
    for (const c of all) {
      const card = page.locator('.card', { has: page.locator('h3', { hasText: c.name }) }).first()
      await expect(card).toBeVisible()
      await expect(card.locator('.addr')).toHaveText(c.path)
      // A card with no sentence is a claim with nothing behind it.
      await expect(card.locator('p')).not.toBeEmpty()
    }
  })

  test('the theme control repaints the page, and it is a cycle', async ({ page }) => {
    await page.goto('/')
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    const toggle = page.locator('nav button').first()

    // Under colorScheme: 'dark', `system` resolves dark. The control then runs
    // system -> light -> dark -> system, and every rung is asserted on the
    // PAINT rather than on the label, so a control that updates its own text
    // and nothing else fails here.
    await expect(toggle).toHaveText('system')
    expect(await bg()).toBe(DARK)

    await toggle.click()
    await expect(toggle).toHaveText('light')
    await expect.poll(bg).toBe(LIGHT)

    await toggle.click()
    await expect(toggle).toHaveText('dark')
    await expect.poll(bg).toBe(DARK)

    await toggle.click()
    await expect(toggle).toHaveText('system')
    await expect.poll(bg).toBe(DARK)
  })

  test('the choice survives a reload', async ({ page }) => {
    // The no-flash script in <head> and the control in Chrome.tsx read one key.
    // If they ever read two, the page paints one theme and then jumps.
    await page.goto('/')
    await page.locator('nav button').first().click() // -> light
    await expect.poll(() =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor),
    ).toBe(LIGHT)

    await page.reload()
    // Measured on the FIRST paint, before React mounts: this is the head
    // script's job, and a miss here is the white flash it exists to prevent.
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(LIGHT)
  })

  test('sign-in goes to Hanzo IAM and nowhere else', async ({ page }) => {
    await page.goto('/')
    // The button must reach hanzo.id's authorize endpoint carrying a PKCE
    // challenge. Anything else — a local form, a password field, a second
    // identity — is the one thing this site may never grow.
    await expect(page.locator('input[type="password"]')).toHaveCount(0)

    const nav = page.waitForRequest(
      (r) => r.url().includes('hanzo.id') && r.url().includes('/oauth/authorize'),
      { timeout: 15_000 },
    )
    await page.getByRole('button', { name: 'Sign in' }).click()
    const url = new URL((await nav).url())
    expect(url.origin).toBe('https://hanzo.id')
    expect(url.searchParams.get('client_id')).toBe('hanzo-works')
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
    expect(url.searchParams.get('code_challenge')).toBeTruthy()
    expect(url.searchParams.get('redirect_uri')).toContain('/auth/callback')
  })
})

test.describe('the page a machine reads', () => {
  test('llms.txt names every capability the page shows', async ({ page }) => {
    // The drift that matters: someone adds a capability card and forgets the
    // index, so the site tells a person about something it never tells a model.
    const txt = await (await page.request.get('/llms.txt')).text()
    for (const c of all) {
      expect(txt, `llms.txt is missing ${c.name}`).toContain(`](https://api.hanzo.ai${c.path})`)
    }
    expect(txt).toContain('hanzoskills.com/llms.txt')
  })

  test('robots.txt welcomes the AI crawlers by name', async ({ page }) => {
    const txt = await (await page.request.get('/robots.txt')).text()
    for (const bot of [
      'GPTBot',
      'ClaudeBot',
      'CCBot',
      'Google-Extended',
      'PerplexityBot',
      'Applebot-Extended',
      'meta-externalagent',
      'Bytespider',
    ]) {
      expect(txt, `robots.txt does not name ${bot}`).toContain(`User-agent: ${bot}`)
    }
    expect(txt).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=yes')
    // Not one Disallow anywhere. The moment this file grows one, say why here.
    expect(txt).not.toMatch(/^Disallow:\s*\S/m)
  })

  test('nothing in the export tells a crawler to stay away', async ({ page }) => {
    await page.goto('/')
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots ?? 'index, follow').not.toContain('noindex')
  })

  test('the callback page exists as a directory index', async ({ page }) => {
    // trailingSlash: true is what makes this resolve. Flat `.html` siblings
    // 404 on a plain file server, and the 404 lands on the OAuth return trip
    // where it is hardest to notice.
    const res = await page.request.get('/auth/callback/')
    expect(res.ok()).toBeTruthy()
    expect(await res.text()).toContain('Signing you in')
  })
})
