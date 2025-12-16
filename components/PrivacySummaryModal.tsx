"use client";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function PrivacySummaryModal({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Privacy summary"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: 420,
                    width: "92%",
                    background: "#0f0f0f",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 20,
                }}
            >
                <h3 style={{ marginTop: 0 }}>Privacy summary</h3>

                <ul style={{ paddingLeft: 18, lineHeight: 1.6 }}>
                    <li>
                        <b>What we store:</b> your email (for early-access updates) and an optional
                        username (to reserve it for you).
                    </li>
                    <li>
                        <b>Why:</b> to notify you about launch and preserve your chosen identity.
                    </li>
                    <li>
                        <b>What we don’t do:</b> no tracking, no profiling, no data sales.
                    </li>
                </ul>

                <p style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
                    You can unsubscribe or request deletion at any time.
                </p>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                    <button className="btn secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
