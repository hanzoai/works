/**
 * The tools Hanzo connects to.
 *
 * Every entry is a connector that ships in hanzoai/extension `packages/`, or a
 * channel Hanzo Bot answers on. Marks come from simple-icons (CC0) and are
 * inlined at build time, so the export carries these paths and no library.
 *
 * A tool whose mark is not freely licensed is named in `alsoConnects` rather
 * than drawn here.
 */
import {
  siDiscord,
  siFigma,
  siGithub,
  siGitlab,
  siGoogle,
  siHubspot,
  siInstructure,
  siJetbrains,
  siJupyter,
  siMatrix,
  siNotion,
  siQuickbooks,
  siRaycast,
  siShopify,
  siSignal,
  siSketch,
  siTelegram,
  siWhatsapp,
  siZendesk,
} from 'simple-icons'

export interface Mark {
  /** The tool's name, as it brands itself. */
  name: string
  /** The 24×24 path data. */
  path: string
}

const mark = (icon: { title: string; path: string }, name?: string): Mark => ({
  name: name ?? icon.title,
  path: icon.path,
})

/** Drawn in the bar, in the order they appear. */
export const integrations: Mark[] = [
  mark(siGoogle, 'Google Workspace'),
  mark(siNotion),
  mark(siHubspot),
  mark(siZendesk),
  mark(siQuickbooks),
  mark(siShopify),
  mark(siFigma),
  mark(siGithub),
  mark(siGitlab),
  mark(siJetbrains),
  mark(siJupyter),
  mark(siRaycast),
  mark(siSketch),
  mark(siInstructure, 'Canvas'),
  mark(siWhatsapp),
  mark(siTelegram),
  mark(siDiscord),
  mark(siSignal),
  mark(siMatrix),
]

/** Shipped connectors and channels whose mark we do not have the right to draw. */
export const alsoConnects = [
  'Salesforce',
  'Slack',
  'Microsoft Teams',
  'Outlook',
  'Office',
  'DocuSign',
  'Canva',
  'Workday',
  'Clio',
  'iManage',
  'Procore',
  'Epic',
]

export const connectorCount = integrations.length + alsoConnects.length
