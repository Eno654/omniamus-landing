import { LogoMark } from "@/components/LogoMark";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Page() {
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
                    <a className="badge" href="/docs/Omniamus_Whitepaper_Official_EN_Revised.pdf" target="_blank" rel="noreferrer">
                        Whitepaper (EN) PDF
                    </a>
                    <a
                        className="badge"
                        href="/docs/Omniamus_Legal_Ethical_Addendum_EN_Revised.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Legal Addendum (EN) PDF
                    </a>
                    <a className="badge" href="/legal">
                        Legal & Ethics
                    </a>
                </div>
            </header>

            {/* HERO */}
            <section className="hero">
                <div className="badge">Independent project • No free rewards • Privacy by design • Early access</div>

                <h1 className="h1" style={{ marginTop: 14 }}>
                    A creator-first platform <br />
                    where value is intentional and quality is measured after consumption.
                </h1>

                <p className="sub">
                    Omniamus is built around a simple idea: content should be unlocked deliberately, appreciation should follow
                    experience, and creators should be paid only when people choose to pay.
                </p>

                <div className="actions">
                    <a
                        className="btn"
                        href="#join"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        Join early access
                    </a>
                    <a
                        className="btn secondary"
                        href="#reserve"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        Reserve your username
                    </a>
                </div>

                <div className="grid" style={{ marginTop: 18 }}>
                    <div className="card">
                        <h3>The problem</h3>
                        <p>
                            Most platforms reward visibility, not value. Creators depend on opaque algorithms, free engagement signals,
                            and artificial incentives that distort quality and trust.
                        </p>
                    </div>

                    <div className="card">
                        <h3>The shift</h3>
                        <p>
                            Omniamus changes when value is measured: content is unlocked intentionally, appreciation comes after
                            consumption, and reputation emerges from real interactions—not hype.
                        </p>
                    </div>

                    <div className="card">
                        <h3>No artificial rewards</h3>
                        <p>
                            Omniamus does not distribute free tokens, incentives, or platform-issued rewards. If value exists, it comes
                            from users—not from the system.
                        </p>
                    </div>

                    <div className="card">
                        <h3>Privacy & responsibility</h3>
                        <p>
                            Privacy by default, minimal data collection, and user control. AI assists with ranking and safety, with
                            human oversight for sensitive decisions.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 1 */}
            <section className="section" style={{ marginTop: 16 }}>
                <h2>The problem</h2>
                <p>
                    Most platforms reward visibility, not value. Creators depend on opaque algorithms, free engagement signals, and
                    artificial incentives that distort quality and trust. Audiences are trained to react before they experience.
                </p>
            </section>

            {/* SECTION 2 */}
            <section className="section">
                <h2>The shift</h2>
                <p>
                    Omniamus changes <b>when</b> value is measured.
                </p>
                <ul>
                    <li>
                        Content is <b>unlocked intentionally</b>.
                    </li>
                    <li>
                        Appreciation comes <b>after</b> consumption.
                    </li>
                    <li>
                        Reputation emerges from <b>real interactions</b>, not hype.
                    </li>
                </ul>
                <p className="mini" style={{ marginTop: 10 }}>
                    No artificial rewards. No inflated engagement. Only value created by people making real choices.
                </p>
            </section>

            {/* SECTION 3 */}
            <section className="section">
                <h2>How creators earn</h2>
                <p>Creators are paid directly by people who choose to unlock their content.</p>
                <p className="mini">
                    Omniamus does not distribute free tokens, incentives, or platform-issued rewards. If value exists, it comes
                    from users—not from the system.
                </p>
            </section>

            {/* SECTION 4 */}
            <section className="section">
                <h2>Much Appreesh</h2>
                <p>
                    Much Appreesh is not a “like”. It is a quality signal available <b>only after</b> content is unlocked. It does
                    not move money.
                </p>
                <p>
                    Over time, Much Appreesh influences visibility, trust, and reputation. Quality compounds—without becoming
                    permanent privilege.
                </p>
            </section>

            {/* SECTION 5 */}
            <section className="section">
                <h2>Payments, simply</h2>
                <p>Omniamus uses a digital unit internally to enable small, transparent payments.</p>
                <p className="mini">
                    It is not an investment asset. There are no airdrops, no staking, and no inflation. All value comes from users
                    paying for content they decide is worth unlocking.
                </p>
            </section>

            {/* SECTION 6 */}
            <section className="section">
                <h2>Privacy by default</h2>
                <ul>
                    <li>Data collection is minimized.</li>
                    <li>Users control their information.</li>
                    <li>Data can be accessed, exported, or deleted.</li>
                    <li>Personal data is never sold.</li>
                    <li>Anonymous publishing and monetization are supported.</li>
                </ul>
            </section>

            {/* SECTION 7 */}
            <section className="section">
                <h2>Responsible use of AI</h2>
                <p>
                    AI assists with ranking and safety. It does not make legal judgments, accusations, or irreversible decisions.
                    Sensitive cases require human oversight.
                </p>
                <p className="mini">AI exists to support fairness—not to replace responsibility.</p>
            </section>

            {/* SECTION 8 */}
            <section className="section">
                <h2>About biometric data</h2>
                <p>
                    Certain advanced features involving biometric data are <b>disabled by default</b>. They require explicit user
                    consent, can be turned off at any time, and allow permanent deletion.
                </p>
                <p className="mini">Omniamus does not build commercial biometric databases.</p>
            </section>

            {/* SECTION 9 */}
            <section className="section">
                <h2>Why this page is simple</h2>
                <p>
                    Systems that shape attention and value require care. Omniamus is introduced at a high level on purpose, while
                    the details evolve through real use, accountability, and responsibility.
                </p>
            </section>

            {/* FOUNDER NOTE (landing-safe, truthful, protected) */}
            <section className="section">
                <h2>Founder note</h2>
                <p>
                    Omniamus did not start as a business idea. It started during a period when I experienced what happens inside
                    systems that reward the wrong signals. In an environment where visibility and power mattered more than
                    integrity or contribution, the absence of accountability became impossible to ignore.
                </p>
                <p>
                    Omniamus is my response to that experience. I wanted to design a system where value is measured deliberately,
                    appreciation follows experience, and creators are paid because people choose to support their work—never
                    because an algorithm or a hierarchy decides their worth.
                </p>
                <p className="mini">
                    This project is built independently, with restraint and care. Omniamus does not promise outcomes. It offers a
                    different structure—one where quality can compound without fear, reputation must continuously justify itself,
                    and freedom exists alongside responsibility.
                </p>
                <p className="mini" style={{ marginTop: 10 }}>
                    — Eno
                </p>
            </section>

            {/* RESERVE */}
            <section id="reserve" className="section">
                <h2>Reserve your username</h2>
                <p>Your name is your identity.</p>
                <ul>
                    <li>Priority access at launch</li>
                    <li>Identity continuity</li>
                    <li>No hype, no promises</li>
                </ul>
                <div className="actions" style={{ marginTop: 10 }}>
                    <a
                        className="btn"
                        href="#join"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        Reserve via waitlist
                    </a>
                </div>
            </section>

            {/* WAITLIST */}
            <section id="join" style={{ marginTop: 16 }}>
                <WaitlistForm />
            </section>

            {/* DOCS */}
            <section className="section">
                <h2>Docs</h2>
                <p>Read the foundations (PDF):</p>
                <ul>
                    <li>
                        <a href="/docs/Omniamus_Whitepaper_Official_EN_Revised.pdf" target="_blank" rel="noreferrer">
                            Official Economic & Ethical Whitepaper (EN)
                        </a>
                    </li>
                    <li>
                        <a href="/docs/Omniamus_Legal_Ethical_Addendum_EN_Revised.pdf" target="_blank" rel="noreferrer">
                            Legal & Ethical Addendum (EN) — GDPR · AI · Biometric Data · Privacy
                        </a>
                    </li>
                </ul>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div>
                    <div style={{ fontWeight: 600 }}>Omniamus</div>
                    <div className="mini">Independent project • creator-first • privacy by design</div>
                    <div className="mini" style={{ marginTop: 8 }}>
                        Nothing on this site is investment advice or a promise of financial returns.
                    </div>
                </div>

                <div className="smalllinks">
                    <a className="mini" href="/legal">
                        Privacy & Ethics
                    </a>
                    <a className="mini" href="/docs/Omniamus_Whitepaper_Official_EN_Revised.pdf" target="_blank" rel="noreferrer">
                        Whitepaper (EN)
                    </a>
                    <a
                        className="mini"
                        href="/docs/Omniamus_Legal_Ethical_Addendum_EN_Revised.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Legal Addendum (EN)
                    </a>
                </div>
            </footer>
        </main>
    );
}
