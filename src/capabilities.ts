/**
 * The business capabilities this site shows.
 *
 * Every row is a capability the cloud actually serves, and `path` is its real
 * address on api.hanzo.ai. `blurb` is the capability's own published
 * description — the sentence its Go package doc states, lifted verbatim into
 * the OpenAPI tag by `openapi.Synopsis` and read back out of `public.yaml`,
 * the ga-only public contract. So the copy on this page cannot describe a
 * product the fleet does not serve: it came from the thing that serves it.
 *
 * `ops` names real operations under that address, for the reader who wants to
 * see the shape rather than the promise. They are a sample, never the whole
 * list — `GET /v1/<name>` is the whole list.
 *
 * Do not add a row here by hand. Add it when the capability answers, and take
 * the sentence from the served document.
 */

export interface Capability {
  /** The capability's name, which is also the first segment after /v1/. */
  name: string
  /** The served address. */
  path: string
  /** The capability's own published description. */
  blurb: string
  /** A few real operations under it. */
  ops: string[]
}

export interface Group {
  /** What this group of capabilities is FOR, in the operator's words. */
  title: string
  /** Why these belong together. */
  note: string
  items: Capability[]
}

export const groups: Group[] = [
  {
    title: 'Work',
    note: 'What the company is doing right now, and the machinery that keeps doing it when nobody is watching.',
    items: [
      {
        name: 'todo',
        path: '/v1/todo',
        blurb: 'Boards, the work items on them, and the filters that make a board.',
        ops: [
          'GET /v1/todo/board',
          'GET /v1/todo/projects',
          'POST /v1/todo/projects/{key}/issues',
          'POST /v1/todo/projects/{key}/issues/{num}/claim',
        ],
      },
      {
        name: 'tasks',
        path: '/v1/tasks',
        blurb: 'Durable workflows that survive a crash, with every run visible and replayable.',
        ops: ['GET /v1/tasks'],
      },
      {
        name: 'auto',
        path: '/v1/auto',
        blurb: 'Workflows that run themselves, on a schedule or a webhook.',
        ops: [
          'GET /v1/auto/flows',
          'POST /v1/auto/flows/{id}/run',
          'GET /v1/auto/runs',
          'POST /v1/auto/hooks/{source}/{event}',
        ],
      },
      {
        name: 'flow',
        path: '/v1/flow',
        blurb: 'Build an agent workflow on a visual canvas, run it, and read every run.',
        ops: ['GET /v1/flow/workflows', 'GET /v1/flow/runs', 'GET /v1/flow/status'],
      },
      {
        name: 'team',
        path: '/v1/team',
        blurb: "Your org's shared workspace: documents edited together, files, seats, and agents as teammates.",
        ops: [
          'GET /v1/team/account',
          'GET /v1/team/files/{workspace}',
          'GET /v1/team/bots',
          'GET /v1/team/billing/plan',
        ],
      },
    ],
  },
  {
    title: 'Customers',
    note: 'Finding them, reaching them, keeping them — and knowing which of those actually worked.',
    items: [
      {
        name: 'crm',
        path: '/v1/crm',
        blurb: 'Your sales pipeline: the companies, the people, the deals in play.',
        ops: [
          'GET /v1/crm/contacts',
          'GET /v1/crm/companies',
          'GET /v1/crm/opportunities',
          'GET /v1/crm/summary',
        ],
      },
      {
        name: 'campaigns',
        path: '/v1/campaigns',
        blurb: 'One go-to-market push across paid, organic and email at once.',
        ops: [
          'POST /v1/campaigns',
          'POST /v1/campaigns/{id}/launch',
          'GET /v1/campaigns/{id}/metrics',
          'POST /v1/campaigns/{id}/pause',
        ],
      },
      {
        name: 'marketing',
        path: '/v1/marketing',
        blurb: 'Lifecycle email: drip sequences that reach the right people.',
        ops: [
          'GET /v1/marketing/audiences',
          'GET /v1/marketing/sequences',
          'POST /v1/marketing/sequences/{id}/enroll',
          'GET /v1/marketing/calendar',
        ],
      },
      {
        name: 'ads',
        path: '/v1/ads',
        blurb: 'Your paid ad campaigns, launched and paused from one place.',
        ops: [
          'GET /v1/ads/campaigns',
          'POST /v1/ads/campaigns/{id}/launch',
          'GET /v1/ads/summary',
        ],
      },
      {
        name: 'content',
        path: '/v1/content',
        blurb: 'Marketing content from draft to published, on every channel.',
        ops: [
          'GET /v1/content/board',
          'POST /v1/content/generate',
          'POST /v1/content/publish',
          'GET /v1/content/channels',
        ],
      },
      {
        name: 'help',
        path: '/v1/help',
        blurb: 'A support desk: customers file tickets, your team answers them.',
        ops: ['GET /v1/help/articles', 'GET /v1/help/categories', 'POST /v1/help/tickets'],
      },
      {
        name: 'channels',
        path: '/v1/channels',
        blurb: 'One inbox for the chat apps you connect — Discord, Slack, Teams, Telegram.',
        ops: [
          'GET /v1/channels',
          'GET /v1/channels/inbox',
          'POST /v1/channels/{channel}/send',
          'POST /v1/channels/pairing',
        ],
      },
      {
        name: 'notify',
        path: '/v1/notify',
        blurb: "Transactional email and SMS, sent through your org's own provider credential.",
        ops: ['POST /v1/notify/send', 'POST /v1/notify/send/email', 'POST /v1/notify/send/sms'],
      },
      {
        name: 'affiliates',
        path: '/v1/affiliates',
        blurb: 'A partner program that pays commission on what your referrals spend.',
        ops: [
          'POST /v1/affiliates/apply',
          'GET /v1/affiliates/me/links',
          'GET /v1/affiliates/me/earnings',
          'GET /v1/affiliates/leaderboard',
        ],
      },
      {
        name: 'referrals',
        path: '/v1/referrals',
        blurb:
          'Referral attribution: who referred whom, and whether that referee ever became a real customer.',
        ops: ['GET /v1/referrals', 'POST /v1/referrals/claim'],
      },
    ],
  },
  {
    title: 'The company itself',
    note: 'The parts a company is made of — the entity, who owns it, what it earned, and what it signed.',
    items: [
      {
        name: 'company',
        path: '/v1/company',
        blurb: 'Incorporation end to end: pick a structure, add founders, pay, file, and e-sign.',
        ops: [
          'POST /v1/company/register',
          'POST /v1/company/founders',
          'POST /v1/company/kyc',
          'POST /v1/company/fundraise/safe',
        ],
      },
      {
        name: 'captable',
        path: '/v1/captable',
        blurb:
          'Your cap table: stakeholders, share classes, grants, SAFEs, rounds, and who owns what.',
        ops: [
          'GET /v1/captable/summary',
          'GET /v1/captable/stakeholders',
          'POST /v1/captable/shares/transfer',
          'POST /v1/captable/rounds/{id}/close',
        ],
      },
      {
        name: 'books',
        path: '/v1/books',
        blurb:
          'Double-entry accounting: chart of accounts, ledger, bank reconciliation, and the reports that prove the books balance.',
        ops: [
          'GET /v1/books/pnl',
          'GET /v1/books/trial',
          'POST /v1/books/bank/sync',
          'POST /v1/books/ask',
        ],
      },
      {
        name: 'esign',
        path: '/v1/esign',
        blurb: 'A document out for signature, signed and filed with an audit trail.',
        ops: [
          'POST /v1/esign/documents',
          'POST /v1/esign/documents/{id}/recipients',
          'POST /v1/esign/documents/{id}/send',
          'GET /v1/esign/documents/{id}/audit',
        ],
      },
      {
        name: 'dataroom',
        path: '/v1/dataroom',
        blurb: 'A secure document room you share by link and watch page by page.',
        ops: [
          'POST /v1/dataroom/datarooms',
          'POST /v1/dataroom/documents',
          'POST /v1/dataroom/links',
          'GET /v1/dataroom/analytics/link/{linkId}',
        ],
      },
    ],
  },
  {
    title: 'Ship',
    note: 'Putting the thing in front of people, and knowing what to do next.',
    items: [
      {
        name: 'projects',
        path: '/v1/projects',
        blurb: 'Where your sites live: create one, deploy a build, roll back to any release.',
        ops: [
          'POST /v1/projects',
          'POST /v1/projects/{slug}/deploy',
          'GET /v1/projects/{slug}/releases',
          'POST /v1/projects/{slug}/domains',
        ],
      },
      {
        name: 'guide',
        path: '/v1/guide',
        blurb: 'A step-by-step checklist that gets your business running on AI.',
        ops: [
          'GET /v1/guide/curriculum',
          'POST /v1/guide/steps/{id}/start',
          'POST /v1/guide/steps/{id}/do',
          'GET /v1/guide/suggest',
        ],
      },
    ],
  },
]

/** How many capabilities the page shows. Derived, never typed by hand. */
export const count = groups.reduce((n, g) => n + g.items.length, 0)
