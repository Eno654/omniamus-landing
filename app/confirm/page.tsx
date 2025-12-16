export default async function ConfirmPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;

    const map: Record<string, { title: string; text: string }> = {
        ok: { title: "Confirmed ✅", text: "Your email is confirmed. You’re on the early access list." },
        expired: { title: "Link expired", text: "This confirmation link is invalid or expired. Please sign up again." },
        invalid: { title: "Invalid link", text: "This confirmation link is not valid." },
        offline: { title: "Not available", text: "Email confirmation is not configured yet." },
    };

    const content = map[status || "invalid"] || map.invalid;

    return (
        <main className="container">
            <section className="section">
                <h1 className="h1" style={{ fontSize: 30 }}>{content.title}</h1>
                <p className="sub">{content.text}</p>
                <div style={{ marginTop: 16 }}>
                    <a className="btn" href="/">Back to Omniamus</a>
                </div>
            </section>
        </main>
    );
}
