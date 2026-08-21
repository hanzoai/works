import { Chrome } from '@/components/Chrome'
import { groups, count } from '@/src/capabilities'

export default function Home() {
  return (
    <>
      <Chrome />

      <div className="hero">
        <div className="wrap">
          <h1>
            Everything a company runs on.
            <br />
            <em>Behind one API.</em>
          </h1>
          <p className="lede">
            Your pipeline, your campaigns, your books, your cap table, your support desk — {count}{' '}
            capabilities on one host, scoped to your org by one identity and metered against one
            balance. Not a suite of products that integrate. One surface, and your agents can
            already reach all of it.
          </p>
          <div className="btns">
            <a className="btn solid" href="https://hanzo.id">
              Sign in
            </a>
            <a className="btn" href="https://api.hanzo.ai/v1">
              Browse the API
            </a>
            <a className="btn" href="/llms.txt">
              Index for agents
            </a>
          </div>
        </div>
      </div>

      <div className="strip">
        <div className="in">
          <b>Every claim here is an address</b>
          <span>curl -H &quot;Authorization: Bearer $TOKEN&quot; https://api.hanzo.ai/v1/crm/summary</span>
        </div>
      </div>

      <div className="wrap">
        {groups.map((g) => (
          <section className="group" key={g.title}>
            <div className="grouphead">
              <h2>{g.title}</h2>
              <p>{g.note}</p>
            </div>
            <div className="cards">
              {g.items.map((c) => (
                <article className="card" key={c.name}>
                  <h3>{c.name}</h3>
                  <span className="addr">{c.path}</span>
                  <p>{c.blurb}</p>
                  <ul className="ops">
                    {c.ops.map((op) => (
                      <li key={op}>{op}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="workspaces">
          <div className="grouphead">
            <h2>Workspaces</h2>
            <p>
              A workspace is not a folder. It is the org — the thing your IAM token names — and it
              is the same boundary in every capability above. There is no second place to add a
              teammate, no second place a document can be private, and no capability that keeps its
              own idea of who you are.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <b>One identity</b>
              <p>
                Sign in once at hanzo.id. The token you get carries your org, and every capability
                scopes its rows to it — physically, in a separate store per org, not by a filter
                someone has to remember to write.
              </p>
            </div>
            <div className="step">
              <b>One balance</b>
              <p>
                Work costs what it costs, from one balance, whether a person did it or an agent
                did. You read the same ledger either way, and a spend cap binds both.
              </p>
            </div>
            <div className="step">
              <b>Teammates who are agents</b>
              <p>
                An agent holds an identity you granted and calls the same routes you do. It claims
                an issue on the board at <code>/v1/todo</code>, drafts the sequence at{' '}
                <code>/v1/marketing</code>, and files the receipt at <code>/v1/books</code>.
              </p>
            </div>
            <div className="step">
              <b>Nothing to integrate</b>
              <p>
                The cap table already knows the company that <code>/v1/company</code> incorporated.
                The data room already holds what <code>/v1/esign</code> signed. They are not
                connected — they were never separate.
              </p>
            </div>
          </div>
        </section>

        <footer>
          <div className="fmap">
            <div>
              <b>Read</b>
              <a href="https://api.hanzo.ai/v1">The API index</a>
              <a href="https://api.hanzo.ai/v1/openapi.json">OpenAPI</a>
              <a href="/llms.txt">llms.txt</a>
              <a href="/robots.txt">robots.txt</a>
            </div>
            <div>
              <b>For agents</b>
              <a href="https://hanzoskills.com/skill.md">Onboarding manifest</a>
              <a href="https://hanzoskills.com/llms.txt">The deep corpus</a>
              <a href="https://hanzoskills.com">Hanzo Skills</a>
            </div>
            <div>
              <b>Hanzo</b>
              <a href="https://hanzo.ai">hanzo.ai</a>
              <a href="https://docs.hanzo.ai">Docs</a>
              <a href="https://hanzo.id">Sign in</a>
              <a href="https://github.com/hanzoai">GitHub</a>
            </div>
          </div>
          <div className="fend">
            Hanzo AI Inc. Every capability named on this page answers at its own address under{' '}
            <code>api.hanzo.ai/v1</code>. If it is not in the OpenAPI document, we do not claim it.
          </div>
        </footer>
      </div>
    </>
  )
}
