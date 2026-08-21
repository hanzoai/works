import { integrations, alsoConnects, connectorCount } from '@/src/integrations'

/**
 * The tools a company already uses, scrolling.
 *
 * A Server Component: the marks are path data inlined at build time, the
 * motion is CSS, so this ships no JavaScript. The track is rendered twice and
 * translated by half its width, which is what makes the loop seamless.
 */
export function Connects() {
  return (
    <section className="connects" id="connects">
      <div className="wrap">
        <h2>Works with what you already run</h2>
      </div>
      <div className="marquee">
        <div className="track">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1}>
              {integrations.map((m) => (
                <li key={m.name}>
                  <svg viewBox="0 0 24 24" width="18" height="18" role="img" aria-hidden="true">
                    <path d={m.path} fill="currentColor" />
                  </svg>
                  <span>{m.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div className="wrap">
        <p className="alsoruns">
          Also connects {alsoConnects.join(', ')} — {connectorCount} in all, and the bot answers on
          the chat apps your team is already in.
        </p>
      </div>
    </section>
  )
}
