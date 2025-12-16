export default function LegalPage() {
    return (
        <main className="container">
            {/* HEADER */}
            <header className="nav">
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <a className="badge" href="/">
                        ← Back
                    </a>
                    <div>
                        <div style={{ fontWeight: 700 }}>Legal & Ethical Framework</div>
                        <div className="mini">High-level public commitment</div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <a
                        className="badge"
                        href="/docs/Omniamus_Whitepaper_Official_EN_Revised.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Whitepaper (EN)
                    </a>
                    <a
                        className="badge"
                        href="/docs/Omniamus_Legal_Ethical_Addendum_EN_Revised.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Legal Addendum (EN)
                    </a>
                </div>
            </header>

            {/* HERO */}
            <section className="hero" style={{ padding: 22 }}>
                <div className="badge">Public commitment</div>
                <h1 className="h1" style={{ fontSize: 30, marginTop: 12 }}>
                    Privacy-first. Ethics-first.
                </h1>
                <p className="sub" style={{ maxWidth: 720 }}>
                    This page summarizes the legal and ethical boundaries of Omniamus.
                    It is intentionally high-level and reflects the principles described in the official documents.
                </p>
            </section>

            {/* PURPOSE */}
            <section className="section">
                <h2>Purpose</h2>
                <p>
                    Omniamus is designed to minimize risk, protect users, and operate lawfully across jurisdictions.
                    Ethics and responsibility are treated as design requirements, not afterthoughts.
                </p>
            </section>

            {/* DATA PROTECTION */}
            <section className="section">
                <h2>Data protection & GDPR</h2>
                <ul>
                    <li>Data collection is minimized by default.</li>
                    <li>Personal data is used only for explicit, declared purposes.</li>
                    <li>Users can access, export, correct, and delete their data.</li>
                    <li>Privacy by design and privacy by default guide all systems.</li>
                    <li>Personal data is never sold.</li>
                </ul>
            </section>

            {/* USER RIGHTS */}
            <section className="section">
                <h2>User control & rights</h2>
                <p>
                    Users remain in control of their experience.
                </p>
                <ul>
                    <li>Algorithmic personalization can be limited or disabled.</li>
                    <li>Anonymity is supported for publishing and monetization.</li>
                    <li>Participation is voluntary and reversible.</li>
                </ul>
            </section>

            {/* AI */}
            <section className="section">
                <h2>Artificial intelligence (AI)</h2>
                <p>
                    AI assists with ranking, moderation support, and abuse prevention.
                </p>
                <ul>
                    <li>AI does not make legal judgments or accusations.</li>
                    <li>No psychological profiling is performed.</li>
                    <li>Sensitive decisions require human oversight.</li>
                    <li>AI exists to support fairness, not to replace responsibility.</li>
                </ul>
            </section>

            {/* BIOMETRICS */}
            <section className="section">
                <h2>Biometric data</h2>
                <p>
                    Certain advanced features may involve biometric data.
                </p>
                <ul>
                    <li>All biometric features are <b>disabled by default</b>.</li>
                    <li>Explicit user consent is required to enable them.</li>
                    <li>Biometric data can be disabled and permanently deleted.</li>
                    <li>Omniamus does not build or sell biometric databases.</li>
                </ul>
            </section>

            {/* LAW ENFORCEMENT */}
            <section className="section">
                <h2>Law enforcement & government requests</h2>
                <ul>
                    <li>Omniamus is not a surveillance platform.</li>
                    <li>Cooperation occurs only under valid legal requests.</li>
                    <li>Requests are limited to public content and documented processes.</li>
                    <li>No informal or undocumented access is granted.</li>
                </ul>
            </section>

            {/* VPN / ACCESS */}
            <section className="section">
                <h2>Privacy tools & access</h2>
                <p>
                    Any optional privacy tools are designed to protect user access and data where lawful.
                </p>
                <p className="mini">
                    Omniamus does not promote the circumvention of laws, censorship systems, or government restrictions.
                </p>
            </section>

            {/* FREEDOM OF EXPRESSION */}
            <section className="section">
                <h2>Freedom of expression</h2>
                <ul>
                    <li>Anonymous expression is permitted.</li>
                    <li>Content moderation focuses on legality and direct harm.</li>
                    <li>Restrictions apply only to illegal content or direct incitement to violence.</li>
                </ul>
            </section>

            {/* TRANSPARENCY */}
            <section className="section">
                <h2>Transparency & accountability</h2>
                <p>
                    Omniamus commits to documentation, auditability, and accountability for all sensitive systems.
                    Ethical design choices are treated as long-term obligations.
                </p>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="mini">
                    This page is a summary. The full legal and ethical framework is defined in the official PDF documents.
                </div>

                <div className="smalllinks">
                    <a
                        className="mini"
                        href="/docs/Omniamus_Whitepaper_Official_EN_Revised.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Whitepaper (EN)
                    </a>
                    <a
                        className="mini"
                        href="/docs/Omniamus_Legal_Ethical_Addendum_EN_Revised.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Legal & Ethical Addendum (EN)
                    </a>
                </div>
            </footer>
        </main>
    );
}
