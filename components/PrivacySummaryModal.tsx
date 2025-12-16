"use client";

import React, { useEffect } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function PrivacySummaryModal({ open, onClose }: Props) {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Privacy summary"
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
            <button
                aria-label="Close privacy summary"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/60"
            />
            <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Privacy summary
                        </h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Short version. No cookies.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/10"
                    >
                        Close
                    </button>
                </div>

                <div className="mt-5 space-y-3 text-sm text-zinc-200">
                    <ul className="list-disc space-y-2 pl-5">
                        <li>
                            We only store what you submit (for example, your email) to confirm
                            your signup and send launch updates.
                        </li>
                        <li>
                            We do not sell your data and we do not use tracking cookies on
                            this page.
                        </li>
                        <li>
                            You can request deletion anytime or unsubscribe with one click.
                        </li>
                    </ul>

                    <p className="text-xs text-zinc-500">
                        Note: this is a short summary. The full policy will be published
                        before product launch.
                    </p>
                </div>
            </div>
        </div>
    );
}
