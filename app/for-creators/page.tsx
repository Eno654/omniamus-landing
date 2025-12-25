// app/for-creators/page.tsx
import { LogoMark } from "../../components/LogoMark";

export default function ForCreatorsPage() {
  return (
    <main className="container">
      <header className="nav">
        <div className="brand">
          <LogoMark />
          <div>
            <div style={{ fontWeight: 700, letterSpacing: 0.4 }}>OMNIAMUS</div>
            <div className="mini">Truth. Reward. Freedom.</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <a className="badge" href="/#how">
            How it works
          </a>
          <a className="badge" href="/for-creators" aria-current="page">
            For creators
          </a>
          <a className="badge" href="/#join">
            Join waitlist
          </a>
          <a className="badge" href="/">
            Back to landing
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="badge">Early-stage experiment • creator-first economics</div>

        <h1 className="h1" style={{ marginTop: 14 }}>
          A quieter way to monetize attention — <br />
          without selling your audience.
        </h1>

        <p className="sub">
          Omniamus explores a simple shift: content can carry value, and quality can be measured after consumption.
          No algorithms to game. No engagement bait. Just transparent economics and signals you can reason about.
        </p>

        <div className="actions">
          <a className="btn" href="/#join">
            Request early access
          </a>
          <a className="btn secondary" href="/#vision">
            Read the public vision
          </a>
        </div>

        <div className="grid" style={{ marginTop: 18 }}>
          <div className="card">
            <h3>Signal over noise</h3>
            <p>Post-consumption signals reduce performative engagement.</p>
          </div>

          <div className="card">
            <h3>Legible economics</h3>
            <p>Clear pricing and split — no hidden mechanics.</p>
          </div>

          <div className="card">
            <h3>Privacy by design</h3>
            <p>Built with restraint: minimal data, maximal clarity.</p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section" style={{ marginTop: 16 }}>
        <h2>Why some creators are looking beyond platforms</h2>
        <p>
          Most platforms optimize for reach. Creators optimize for survival. Quality gets lost in between.
        </p>
        <ul>
          <li>unpredictable payouts</li>
          <li>pressure to post more, not better</li>
          <li>engagement that can be faked</li>
          <li>audiences trained to consume without valuing</li>
        </ul>
        <p className="mini" style={{ marginTop: 10 }}>
          Omniamus exists to test a different framing.
        </p>
      </section>

      <section className="section">
        <h2>The core idea (in one minute)</h2>
        <ol>
          <li>You publish content.</li>
          <li>Viewers unlock it for a small, transparent amount.</li>
          <li>
            Only buyers can signal quality after consumption using <b>Much Appreesh</b>.
          </li>
          <li>Signals are public, legible, and hard to fake.</li>
        </ol>
        <p className="mini" style={{ marginTop: 10 }}>
          No likes. No boosts. No black boxes.
        </p>
      </section>

      <section className="section">
        <h2>Why this matters for established creators</h2>
        <p>If you already have reach, you already know:</p>
        <ul>
          <li>likes don’t reflect value</li>
          <li>comments don’t scale with quality</li>
          <li>sponsorships distort voice</li>
          <li>subscriptions reward frequency, not insight</li>
        </ul>
        <p className="mini" style={{ marginTop: 10 }}>
          Omniamus doesn’t replace your platforms. It gives you another surface — one designed for value, not volume.
        </p>
      </section>

      <section className="section">
        <h2>Economics (transparent by design)</h2>
        <ul>
          <li>Micro-transactions per post (you set the price)</li>
          <li>Clear split (no hidden fees)</li>
          <li>No pay-to-boost</li>
          <li>No algorithmic throttling</li>
        </ul>
        <p className="mini" style={{ marginTop: 10 }}>
          Your audience decides what’s worth paying for — <b>after</b> they’ve consumed it.
        </p>
      </section>

      <section className="section">
        <h2>What Omniamus is NOT</h2>
        <ul>
          <li>not a social network</li>
          <li>not a growth hack</li>
          <li>not a follower farm</li>
          <li>not an NFT / hype play</li>
          <li>not a replacement for what already works for you</li>
        </ul>
        <p className="mini" style={{ marginTop: 10 }}>
          This is an experiment. Public. Pragmatic. Evolving.
        </p>
      </section>

      <section className="section">
        <h2>Who this is for (and who it isn’t)</h2>
        <div className="grid" style={{ marginTop: 10 }}>
          <div className="card">
            <h3>This may resonate if you:</h3>
            <ul>
              <li>care about signal over noise</li>
              <li>already have an audience</li>
              <li>publish things that hold value beyond a scroll</li>
              <li>want monetization without distortion</li>
            </ul>
          </div>

          <div className="card">
            <h3>This probably isn’t for you if you:</h3>
            <ul>
              <li>rely on virality mechanics</li>
              <li>optimize for constant output</li>
              <li>need algorithmic amplification</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Early access (quietly open)</h2>
        <p>
          No exclusivity. No posting requirements. No pressure. Just a chance to test whether this model makes sense for you and your audience.
        </p>
        <div className="actions" style={{ marginTop: 10 }}>
          <a className="btn" href="/#join">
            Request early access
          </a>
          <a className="btn secondary" href="/">
            Back to landing
          </a>
        </div>

        <p className="mini" style={{ marginTop: 12 }}>
          Omniamus isn’t trying to convince anyone. It’s here for people who already feel that something about current platforms is misaligned.
        </p>
      </section>

      <footer className="footer">
        <div>
          <div style={{ fontWeight: 600 }}>Omniamus</div>
          <div className="mini">Independent project • creator-first • privacy by design</div>
        </div>

        <div className="smalllinks">
          <a className="mini" href="/#join">
            Join waitlist
          </a>
          <a className="mini" href="/">
            Home
          </a>
        </div>
      </footer>
    </main>
  );
}
