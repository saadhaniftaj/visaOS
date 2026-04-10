"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-form-side">
        <Link href="/" className="nav-logo" style={{ marginBottom: "var(--space-12)" }}>
          <span className="nav-logo-mark">V</span>
          VisaOS
        </Link>

        <h1 className="auth-form-title">Create your account</h1>
        <p className="auth-form-subtitle">Start your free visa eligibility assessment.</p>

        {error && (
          <div style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--accent-red-muted)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "var(--radius-md)",
            color: "var(--accent-red)",
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-4)",
          }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="input"
              placeholder="John Alexander Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="register-button" style={{ width: "100%", marginTop: "var(--space-2)" }}>
            {loading ? <span className="spinner" /> : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </div>

      <div className="auth-decor-side">
        <div className="auth-decor-content">
          <div style={{ fontSize: "3.5rem", marginBottom: "var(--space-6)" }}>⚡</div>
          <h2 className="auth-decor-title">Begin your<br />immigration journey</h2>
          <p className="auth-decor-text">
            Join professionals building winning visa cases with 
            AI-powered intelligence. No payment required — ever.
          </p>
        </div>
      </div>
    </div>
  );
}
