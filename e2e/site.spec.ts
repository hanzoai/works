import { test, expect } from '@playwright/test'
import { sections, rows, appCount } from '../src/products'
import { integrations } from '../src/integrations'

const products = sections.flatMap((s) => s.items)
const apps = rows.flatMap((r) => r.items)

/** The two grounds the design system paints, as the browser reports them. */
const DARK = 'rgb(10, 10, 10)' //  :root  --background
const LIGHT = 'rgb(247, 247, 247)' // .light --background

test.describe('the page a person sees', () => {
  // State the scheme rather than inheriting it. Playwright's Desktop Chrome
  // reports `prefers-color-scheme: light`, so a test that just loads the page
  // measures the runner's preference and calls it the site's default.
  test.use({ colorScheme: 'dark' })

  test('the hero renders, and it renders on the design system', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Run the company')

    // Not "is the class there" — is the page PAINTED in the system's colours.
    // A missing @hanzo/design import leaves a transparent body and a browser
    // default font, both visible here and nowhere else in the toolchain.
    const painted = await page.evaluate(() => {
      const s = getComputedStyle(document.body)
      return { bg: s.backgroundColor, color: s.color, font: s.fontFamily }
    })
    expect(painted.bg).toBe(DARK)
    expect(painted.color).toBe('rgb(229, 229, 229)') // --foreground
    expect(painted.font).toContain('Geist') // the system's own face, self-hosted
  })

  test('the buttons are pills, the cards are round', async ({ page }) => {
    await page.goto('/')
    // hanzo.ai sets its calls to action in --radius-full. Measure the computed
    // value, because a square button is the defect this asserts against and a
    // class name cannot show it.
    const btns = page.locator('.btn')
    await expect(btns).toHaveCount(3)
    for (let i = 0; i < 3; i++) {
      const el = btns.nth(i)
      const { radius, height } = await el.evaluate((n) => ({
        radius: parseFloat(getComputedStyle(n).borderTopLeftRadius),
        height: n.getBoundingClientRect().height,
      }))
      // A pill's radius is at least half its height; --radius-full is 9999px.
      expect(radius, 'button is not rounded').toBeGreaterThanOrEqual(height / 2)
    }

    const cardRadius = await page
      .locator('.card')
      .first()
      .evaluate((n) => parseFloat(getComputedStyle(n).borderTopLeftRadius))
    expect(cardRadius).toBeGreaterThanOrEqual(16) // --radius-2xl is 24px
  })

  test('the mark is present and has real size', async ({ page }) => {
    await page.goto('/')
    const mark = page.locator('nav svg').first()
    await expect(mark).toBeVisible()
    const box = await mark.boundingBox()
    expect(box!.width).toBeGreaterThan(8)
    expect(box!.height).toBeGreaterThan(8)
  })

  test('every product is on the page, with the address that serves it', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.card')).toHaveCount(products.length)
    for (const p of products) {
      const card = page.locator('.card', { has: page.locator('h3', { hasText: p.name }) }).first()
      await expect(card).toBeVisible()
      await expect(card.locator('.addr')).toHaveText(p.at)
      await expect(card.locator('p')).not.toBeEmpty()
      await expect(card.locator('.cardgo')).toHaveAttribute('href', p.href)
    }
  })

  test('every business app is listed at its own address', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.row li')).toHaveCount(appCount)
    for (const a of apps) {
      const li = page.locator('.row li', { has: page.locator('a', { hasText: a.name }) }).first()
      await expect(li.locator('i')).toHaveText(a.at)
    }
  })

  test('the works-with bar carries every mark and it scrolls', async ({ page }) => {
    await page.goto('/')
    // Two copies of the track, so the loop has no seam.
    await expect(page.locator('.track li')).toHaveCount(integrations.length * 2)
    for (const m of integrations) {
      await expect(page.locator('.track li span', { hasText: m.name }).first()).toBeVisible()
    }
    // Name AND logo, not one or the other.
    expect(await page.locator('.track li svg').count()).toBe(integrations.length * 2)

    // The motion is real: the track is wider than its window and animating.
    const moving = await page.locator('.track').evaluate((n) => {
      const s = getComputedStyle(n)
      return {
        name: s.animationName,
        duration: s.animationDuration,
        wider: n.scrollWidth > (n.parentElement?.clientWidth ?? 0),
      }
    })
    expect(moving.name).toBe('slide')
    expect(moving.duration).not.toBe('0s')
    expect(moving.wider).toBeTruthy()
  })

  test('it renders on a phone', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const p = await ctx.newPage()
    await p.goto('/')
    await expect(p.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(p.locator('.card').first()).toBeVisible()

    // Nothing may spill sideways. A card wider than the window is the usual
    // cause and it is invisible at desktop width.
    const spill = await p.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(spill, 'the page scrolls horizontally at 390px').toBeLessThanOrEqual(1)
    await ctx.close()
  })

  test('the theme control repaints the page, and it is a cycle', async ({ page }) => {
    await page.goto('/')
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    const toggle = page.locator('nav button').first()

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
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe(LIGHT)

    await page.reload()
    // Measured on the FIRST paint, before React mounts: the head script's job,
    // and a miss here is the white flash it exists to prevent.
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(LIGHT)
  })

  test('an unset preference follows the operating system, both ways', async ({ browser }) => {
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

  test('sign-in goes to Hanzo IAM and nowhere else', async ({ page }) => {
    await page.goto('/')
    // The button must reach hanzo.id's authorize endpoint carrying a PKCE
    // challenge. A local form, a password field or a second identity is the one
    // thing this site may never grow.
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

test.describe('the links', () => {
  test('every link is absolute https or a local anchor', async ({ page }) => {
    await page.goto('/')
    const hrefs = await page.locator('a[href]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href') ?? ''),
    )
    expect(hrefs.length).toBeGreaterThan(20)
    for (const h of hrefs) {
      expect(h, `${h} is neither https nor local`).toMatch(/^(https:\/\/|\/|#)/)
    }
  })

  test('every host this page sends a reader to answers', async ({ request }) => {
    // A business site with a dead link is a broken promise. This walks the real
    // network, so it fails when a product goes down — which is the point.
    test.slow()
    const urls = [...new Set((await Promise.resolve([...products, ...apps])).map((p) => p.href))]
    const dead: string[] = []
    await Promise.all(
      urls.map(async (u) => {
        for (let tries = 0; tries < 2; tries++) {
          try {
            const r = await request.get(u, { timeout: 25_000, maxRedirects: 5 })
            if (r.status() < 400) return
          } catch {
            /* retry once, then record it */
          }
        }
        dead.push(u)
      }),
    )
    expect(dead, `dead links: ${dead.join(', ')}`).toEqual([])
  })
})

test.describe('the page a machine reads', () => {
  test('llms.txt names every product the page shows', async ({ page }) => {
    // The drift that matters: someone adds a card and forgets the index, so the
    // site tells a person about something it never tells a model.
    const txt = await (await page.request.get('/llms.txt')).text()
    for (const p of [...products, ...apps]) {
      expect(txt, `llms.txt is missing ${p.name}`).toContain(`](${p.href})`)
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
