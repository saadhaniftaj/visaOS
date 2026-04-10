"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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

        <h1 className="auth-form-title">Welcome back</h1>
        <p className="auth-form-subtitle">Sign in to continue your visa assessment.</p>

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

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="login-button" style={{ width: "100%", marginTop: "var(--space-2)" }}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/register">Create one</Link>
        </p>
      </div>

      <div className="auth-decor-side">
        <div className="auth-decor-content">
          <div style={{ fontSize: "3.5rem", marginBottom: "var(--space-6)" }}>🇺🇸</div>
          <h2 className="auth-decor-title">The Immigration Operating System</h2>
          <p className="auth-decor-text">
            Speed. Excellence. Care.<br />
            Evaluate your O-1A and E-2 eligibility with AI precision 
            built on 2026 USCIS standards.
          </p>
        </div>
      </div>
    </div>
  );
}
