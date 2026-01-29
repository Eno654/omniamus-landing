"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("creator");
  const [country, setCountry] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    // Client-side validation
    if (!email || !ageConfirmed || !consent) {
      setStatus("error");
      setMessage("Please fill in your email and confirm the checkboxes.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim() || null,
          role,
          country: country.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "You're on the list!");
      
      // Clear form on success
      setEmail("");
      setUsername("");
      setRole("creator");
      setCountry("");
      setAgeConfirmed(false);
      setConsent(false);

    } catch (error) {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  }

  return (
    <div className="section">
      <h2>Join the Waitlist</h2>
      <p>Get early access and reserve your username.</p>

      {status === "success" ? (
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h3>You're on the list!</h3>
          <p>{message}</p>
          <button 
            className="btn secondary" 
            onClick={() => setStatus("idle")}
            style={{ marginTop: 12 }}
          >
            Add another email
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="form">
          <div className="field">
            <label htmlFor="email">Email address *</label>
            <input
              id="email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
            />
          </div>

          <div className="field">
            <label htmlFor="username">Desired username</label>
            <input
              id="username"
              type="text"
              placeholder="@yourname (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={status === "loading"}
            />
            <span className="hint">3-20 characters, letters, numbers, underscores only</span>
          </div>

          <div className="field">
            <label htmlFor="role">I am a... *</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={status === "loading"}
            >
              <option value="creator">Creator</option>
              <option value="viewer">Viewer</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              placeholder="Optional"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={status === "loading"}
            />
          </div>

          <div className="field full">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                disabled={status === "loading"}
              />
              <span>I confirm I am 18 or older *</span>
            </label>
          </div>

          <div className="field full">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                disabled={status === "loading"}
              />
              <span>I agree to be contacted about early access *</span>
            </label>
          </div>

          <div className="field full">
            <button
              type="submit"
              className="btn"
              disabled={status === "loading"}
              style={{ width: "100%" }}
            >
              {status === "loading" ? "Joining..." : "Reserve my spot"}
            </button>
          </div>

          {status === "error" && message && (
            <div className="field full">
              <p className="error-text">{message}</p>
            </div>
          )}
        </form>
      )}

      <p className="note">
        We'll confirm username availability within 24 hours. No spam, ever.
      </p>
    </div>
  );
}
