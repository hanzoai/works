import { Chrome } from '@/components/Chrome'
import { Connects } from '@/components/Connects'
import { sections, rows, appCount } from '@/src/products'

export default function Home() {
  return (
    <>
      <Chrome />

      <div className="hero">
        <div className="wrap">
          <h1>
            Run the company on Hanzo.
            <br />
            <em>People and agents alike.</em>
          </h1>
          <p className="lede">
            Put the extension in the browser, the bot on your team&apos;s chat, and Team on the
            desk. Behind them sit {appCount} business apps — CRM, support desk, books, cap table,
            e-sign — on one login and one bill. An agent you hire uses the same ones your people
            do.
          </p>
          <div className="btns">
            <a
              className="btn solid"
              href="https://github.com/hanzoai/extension/releases/latest"
            >
              Get the extension
            </a>
            <a className="btn" href="https://hanzo.team">
              Open Hanzo Team
            </a>
            <a className="btn" href="#connects">
              See what connects
            </a>
          </div>
        </div>
      </div>

      <Connects />

      <div className="wrap">
        {sections.map((s) => (
          <section className="group" key={s.title}>
            <div className="grouphead">
              <h2>{s.title}</h2>
              <p>{s.note}</p>
            </div>
            <div className="cards">
              {s.items.map((p) => (
                <article className="card" key={p.name}>
                  <h3>{p.name}</h3>
                  <span className="addr">{p.at}</span>
                  <p>{p.does}</p>
                  <a className="cardgo" href={p.href}>
                    {p.verb}
                  </a>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="group">
          <div className="grouphead">
            <h2>Run the company</h2>
            <p>
              The back office, already running. Each one answers at its own address, holds your
              org&apos;s data and nobody else&apos;s, and bills against the same balance as the
              rest.
            </p>
          </div>
          <div className="rows">
            {rows.map((r) => (
              <div className="row" key={r.title}>
                <b>{r.title}</b>
                <ul>
                  {r.items.map((a) => (
                    <li key={a.name}>
                      <a href={a.href}>{a.name}</a>
                      <span>{a.does}</span>
                      <i>{a.at}</i>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="workspaces">
          <div className="grouphead">
            <h2>One org</h2>
            <p>
              A workspace here is the org itself — the thing your login names — and it is the same
              boundary in every app above. There is no second place to add a teammate and no app
              that keeps its own idea of who you are.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <b>One login</b>
              <p>
                Sign in once. Every app scopes what it shows to your org, in a separate store per
                org rather than a filter someone has to remember to write.
              </p>
            </div>
            <div className="step">
              <b>One bill</b>
              <p>
                Work costs what it costs, from one balance, whether a person did it or an agent
                did. You read the same ledger either way and one cap binds both.
              </p>
            </div>
            <div className="step">
              <b>Agents as staff</b>
              <p>
                An agent holds an identity you granted and opens the same apps you do. It takes an
                item off the board, drafts the sequence, files the receipt.
              </p>
            </div>
            <div className="step">
              <b>Nothing to integrate</b>
              <p>
                The cap table already knows the company you incorporated. The data room already
                holds what you signed. They were never separate systems.
              </p>
            </div>
          </div>
        </section>

        <footer>
          <div className="fmap">
            <div>
              <b>Install</b>
              <a href="https://github.com/hanzoai/extension/releases/latest">Browser extension</a>
              <a href="https://hanzo.bot">Hanzo Bot</a>
              <a href="https://github.com/hanzoai/extension/releases/latest">Desktop</a>
            </div>
            <div>
              <b>Open</b>
              <a href="https://hanzo.team">Hanzo Team</a>
              <a href="https://hanzo.chat">Hanzo Chat</a>
              <a href="https://hanzo.app">Hanzo App</a>
              <a href="https://console.hanzo.ai">Console</a>
            </div>
            <div>
              <b>Hanzo</b>
              <a href="https://hanzo.ai">hanzo.ai</a>
              <a href="https://docs.hanzo.ai">Docs</a>
              <a href="https://console.hanzo.ai">Sign in</a>
              <a href="https://github.com/hanzoai">GitHub</a>
            </div>
          </div>
          <div className="fend">
            Hanzo AI Inc. Every product named here serves at the address beside it. The same work
            is reachable from <code>api.hanzo.ai/v1</code>, which is how your agents get at it.
          </div>
        </footer>
      </div>
    </>
  )
}
