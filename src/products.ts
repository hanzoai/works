/**
 * The products a company installs and uses.
 *
 * `at` is the address that serves the product and every one of them answers.
 * A product goes here when it is running, not when it is planned.
 */

export interface Product {
  /** How Hanzo brands it. */
  name: string
  /** What it does, in plain words. */
  does: string
  /** Where it serves. */
  at: string
  /** The link target. */
  href: string
  /** What the reader does next. */
  verb: string
}

export interface Section {
  /** The section heading. */
  title: string
  /** What these products have in common. */
  note: string
  items: Product[]
}

/** Downloads. Chrome, Firefox, Safari, macOS, Windows, Linux builds ship here. */
const RELEASES = 'https://github.com/hanzoai/extension/releases/latest'

export const sections: Section[] = [
  {
    title: 'Install',
    note: 'Three things that run where you already work — the browser, your phone, your own machine.',
    items: [
      {
        name: 'Hanzo Extension',
        does: 'Ask about the page you are on, search from the address bar, and let an agent read and act in the tab. Chrome, Firefox and Safari.',
        at: 'github.com/hanzoai/extension',
        href: RELEASES,
        verb: 'Download',
      },
      {
        name: 'Hanzo Bot',
        does: 'An assistant that answers on the chat apps your team already uses — WhatsApp, Telegram, Discord, Signal, Matrix and a dozen more. Runs on your own machine.',
        at: 'hanzo.bot',
        href: 'https://hanzo.bot',
        verb: 'Install',
      },
      {
        name: 'Hanzo Desktop',
        does: 'Build agents and run models on your own hardware, with nothing leaving the machine. macOS, Windows and Linux.',
        at: 'github.com/hanzoai/extension',
        href: RELEASES,
        verb: 'Download',
      },
    ],
  },
  {
    title: 'Work',
    note: 'Where the day happens: talking to each other, meeting, and keeping the calendar.',
    items: [
      {
        name: 'Hanzo Team',
        does: 'Chat, projects, CRM, HR and hiring in one workspace, with agents on the team as members.',
        at: 'hanzo.team',
        href: 'https://hanzo.team',
        verb: 'Open',
      },
      {
        name: 'Hanzo Chat',
        does: 'Chat across models with agents, tools and your own documents in reach.',
        at: 'hanzo.chat',
        href: 'https://hanzo.chat',
        verb: 'Open',
      },
      {
        name: 'Hanzo Meet',
        does: 'Video rooms for the org, with access decided by the same identity as everything else.',
        at: 'meet.hanzo.ai',
        href: 'https://meet.hanzo.ai',
        verb: 'Open',
      },
      {
        name: 'Hanzo Calendar',
        does: 'Booking pages and scheduling that other people can actually reach.',
        at: 'cal.hanzo.ai',
        href: 'https://cal.hanzo.ai',
        verb: 'Open',
      },
    ],
  },
  {
    title: 'Build',
    note: 'Ship the thing you sell, without standing up a stack to do it.',
    items: [
      {
        name: 'Hanzo App',
        does: 'Describe a web app and get one, deployed on a real address you control.',
        at: 'hanzo.app',
        href: 'https://hanzo.app',
        verb: 'Open',
      },
      {
        name: 'Hanzo Studio',
        does: 'Author, test and publish agents against your own data.',
        at: 'studio.hanzo.ai',
        href: 'https://studio.hanzo.ai',
        verb: 'Open',
      },
      {
        name: 'Hanzo Base',
        does: 'A database, files and auth for what you build, per org.',
        at: 'base.hanzo.ai',
        href: 'https://base.hanzo.ai',
        verb: 'Open',
      },
    ],
  },
]

/** The business apps, at the address each one serves. */
export interface App {
  name: string
  does: string
  at: string
  href: string
}

export interface Row {
  title: string
  items: App[]
}

export const rows: Row[] = [
  {
    title: 'Customers',
    items: [
      {
        name: 'CRM',
        does: 'The companies, the people, the deals in play.',
        at: 'crm.hanzo.ai',
        href: 'https://crm.hanzo.ai',
      },
      {
        name: 'Support',
        does: 'Customers file tickets, your team answers them.',
        at: 'help.hanzo.ai',
        href: 'https://help.hanzo.ai',
      },
      {
        name: 'Publish',
        does: 'Write once and post it on every channel you run.',
        at: 'social.hanzo.ai',
        href: 'https://social.hanzo.ai',
      },
      {
        name: 'Ads',
        does: 'Paid campaigns, launched and paused from one place.',
        at: 'ads.hanzo.ai',
        href: 'https://ads.hanzo.ai',
      },
      {
        name: 'Marketing',
        does: 'Lifecycle email that reaches the right people.',
        at: 'marketing.hanzo.ai',
        href: 'https://marketing.hanzo.ai',
      },
    ],
  },
  {
    title: 'Money',
    items: [
      {
        name: 'Books',
        does: 'Double-entry accounting, bank reconciliation, and reports that balance.',
        at: 'console.hanzo.ai/books',
        href: 'https://console.hanzo.ai/books',
      },
      {
        name: 'Finance',
        does: 'The wallet your org pays from: deposits in, usage out.',
        at: 'finance.hanzo.ai',
        href: 'https://finance.hanzo.ai',
      },
      {
        name: 'Pay',
        does: 'Take payment, on your own checkout.',
        at: 'pay.hanzo.ai',
        href: 'https://pay.hanzo.ai',
      },
      {
        name: 'Commerce',
        does: 'Catalog, pricing, invoices and subscriptions.',
        at: 'commerce.hanzo.ai',
        href: 'https://commerce.hanzo.ai',
      },
      {
        name: 'Billing',
        does: 'What you spent, on what, against one balance.',
        at: 'billing.hanzo.ai',
        href: 'https://billing.hanzo.ai',
      },
    ],
  },
  {
    title: 'The company',
    items: [
      {
        name: 'Cap table',
        does: 'Stakeholders, share classes, grants, SAFEs and rounds.',
        at: 'captable.hanzo.ai',
        href: 'https://captable.hanzo.ai',
      },
      {
        name: 'eSign',
        does: 'A document out for signature, signed and filed with an audit trail.',
        at: 'esign.hanzo.ai',
        href: 'https://esign.hanzo.ai',
      },
      {
        name: 'Data room',
        does: 'A document room you share by link and watch page by page.',
        at: 'dataroom.hanzo.ai',
        href: 'https://dataroom.hanzo.ai',
      },
      {
        name: 'Analytics',
        does: 'Who came to your site and what they did.',
        at: 'analytics.hanzo.ai',
        href: 'https://analytics.hanzo.ai',
      },
      {
        name: 'Insights',
        does: 'What your agents did, what it cost, and where it broke.',
        at: 'insights.hanzo.ai',
        href: 'https://insights.hanzo.ai',
      },
    ],
  },
  {
    title: 'Getting it done',
    items: [
      {
        name: 'Todo',
        does: 'Boards and the work items on them.',
        at: 'todo.hanzo.ai',
        href: 'https://todo.hanzo.ai',
      },
      {
        name: 'Tasks',
        does: 'Long jobs that survive a crash, every run replayable.',
        at: 'tasks.hanzo.ai',
        href: 'https://tasks.hanzo.ai',
      },
      {
        name: 'Flow',
        does: 'Draw an agent workflow on a canvas and run it.',
        at: 'flow.hanzo.ai',
        href: 'https://flow.hanzo.ai',
      },
      {
        name: 'Automations',
        does: 'Work that runs itself, on a schedule or a webhook.',
        at: 'auto.hanzo.ai',
        href: 'https://auto.hanzo.ai',
      },
      {
        name: 'Search',
        does: 'One search across everything your org has.',
        at: 'search.hanzo.ai',
        href: 'https://search.hanzo.ai',
      },
    ],
  },
]

/** How many apps the page lists. Derived. */
export const appCount = rows.reduce((n, r) => n + r.items.length, 0)
