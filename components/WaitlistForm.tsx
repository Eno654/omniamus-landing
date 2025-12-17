"use client";

import { useMemo, useState } from "react";
import PrivacySummaryModal from "./PrivacySummaryModalClean";
import PrivacySummaryModalClean from "./PrivacySummaryModalClean";

type Role = "Creator" | "Viewer" | "Press";

export function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState<Role>("Creator");
    const [country, setCountry] = useState("");

    const [ageConfirmed, setAgeConfirmed] = useState(false);
    const [consent, setConsent] = useState(false);

    const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
    const [message, setMessage] = useState("");

    const [showPrivacy, setShowPrivacy] = useState(false);

    // resend
    const [resendStatus, setResendStatus] =
        useState<"idle" | "loading" | "done">("idle");

    const isValidEmail = useMemo(
        () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
        [email]
    );

    const canSubmit =
        isValidEmail && ageConfirmed && consent && status !== "loading";

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    username: username.trim() || null,
                    role,
                    country: country.trim() || null,
                    ageConfirmed,
                    ageText:
                        "I confirm I am at least 16 years old (or the minimum age required in my country).",
                    consent,
                    consentText:
                        "I agree to receive early-access updates from Omniamus and understand I can unsubscribe anytime.",
                    source: "landing",
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Submission failed.");

            setStatus("ok");
            setMessage(
                "You’re on the list. Please check your email to confirm."
            );

            // reset
            setUsername("");
            setCountry("");
            setRole("Creator");
            setAgeConfirmed(false);
            setConsent(false);
        } catch (err: any) {
            setStatus("error");
            setMessage(err?.message || "Something went wrong.");
        }
    }

    async function resend() {
        if (!isValidEmail) return;
        setResendStatus("loading");

        await fetch("/api/waitlist/resend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim() }),
        }).catch(() => { });

        setResendStatus("done");
        setTimeout(() => setResendStatus("idle"), 4000);
    }

    return (
        <form className="section" onSubmit={submit}>
            <h2>Early access</h2>
            <p>Reserve your username and get launch updates.</p>

            <div className="form">
                <div className="field full">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        required
                    />
                </div>

                <div className="field">
                    <label>Username (optional)</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={30}
                    />
                </div>

                <div className="field">
                    <label>I’m a</label>
                    <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                        <option value="Creator">Creator</option>
                        <option value="Viewer">Viewer</option>
                        <option value="Press">Press</option>
                    </select>
                </div>

                <div className="field full">
                    <label>Country (optional)</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>

                {/* age */}
                <div className="field full">
                    <label style={{ display: "flex", gap: 10 }}>
                        <input
                            type="checkbox"
                            checked={ageConfirmed}
                            onChange={(e) => setAgeConfirmed(e.target.checked)}
                            required
                        />
                        <span>I confirm I am at least 16 years old.</span>
                    </label>
                </div>

                {/* consent */}
                <div className="field full">
                    <label style={{ display: "flex", gap: 10 }}>
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            required
                        />
                        <span>
                            I agree to receive early-access updates.{" "}
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setShowPrivacy(true);
                            }}>
                                Privacy summary
                            </a>
                        </span>
                    </label>
                </div>

                <div className="actions">
                    <button className="btn" disabled={!canSubmit}>
                        {status === "loading" ? "Joining..." : "Join waitlist"}
                    </button>
                </div>
            </div>

            <div className="note">
                {status === "ok" && (
                    <>
                        <p>✅ {message}</p>

                        <p style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>
                            Didn’t get the email? Check your spam folder or resend the confirmation link.
                        </p>

                        <button
                            type="button"
                            className="btn secondary"
                            onClick={resend}
                            disabled={resendStatus === "loading"}
                            style={{ marginTop: 8 }}
                        >
                            {resendStatus === "loading"
                                ? "Sending…"
                                : resendStatus === "done"
                                    ? "Sent"
                                    : "Resend confirmation email"}
                        </button>
                    </>
                )}

                {status === "error" && <p>⚠️ {message}</p>}
            </div>

            <PrivacySummaryModalClean
                open={showPrivacy}
                onClose={() => setShowPrivacy(false)}
            />
        </form>
    );
}
