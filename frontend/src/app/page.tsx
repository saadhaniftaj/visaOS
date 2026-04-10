"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`} id="main-nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-mark">V</span>
            VisaOS
          </Link>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><Link href="/login" className="btn btn-ghost">Sign In</Link></li>
            <li><Link href="/register" className="btn btn-primary" id="cta-register">Start Free →</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero — Founder-Led */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content animate-in">
              <div className="hero-eyebrow">
                <span style={{ color: "var(--accent-gold)" }}>●</span>
                The Immigration Operating System
              </div>
              <h1 className="hero-title">
                Your visa case,<br />
                built to win.
              </h1>
              <p className="hero-subtitle">
                VisaOS evaluates your O-1A or E-2 eligibility with precision — 
                scoring every criterion against 2026 USCIS standards so you know 
                exactly where you stand before you spend a dollar on legal fees.
              </p>
              <div className="hero-actions">
                <Link href="/register" className="btn btn-primary btn-lg" id="hero-cta">
                  Start Your Assessment
                </Link>
                <Link href="#how-it-works" className="btn btn-secondary btn-lg">
                  See How It Works
                </Link>
              </div>

              {/* Inline Stats */}
              <div style={{ display: "flex", gap: "var(--space-10)" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 700 }}>8</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>O-1A Criteria</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 700 }}>2026</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>USCIS Standards</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 700 }}>Free</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>No Paywall</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hero-image-wrapper animate-slide-up">
              <div className="hero-image-card">
                <img
                  src="/hero-founder.jpg"
                  alt="Professional portrait"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip — Social Proof */}
      <section className="trust-strip" id="trust">
        <div className="container">
          <div className="trust-label">Trusted by professionals from</div>
          <div className="trust-logos">
            <span>Google</span>
            <span>Meta</span>
            <span>Stripe</span>
            <span>YC</span>
            <span>Stanford</span>
            <span>MIT</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Platform Capabilities</div>
            <h2 className="section-title">Everything you need to build a winning case</h2>
            <p className="section-subtitle">
              From eligibility scoring to LLC sponsorship guidance — one platform, 
              complete clarity.
            </p>
          </div>

          <div className="grid grid-3 stagger">
            <div className="card card-elevated card-hover feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">O-1A Eligibility Engine</h3>
              <p className="feature-desc">
                Scores all 8 extraordinary ability criteria. 2026 updates: hackathon 
                judging, OSS code review, and digital publications now count.
              </p>
            </div>
            <div className="card card-elevated card-hover feature-card">
              <div className="feature-icon">📐</div>
              <h3 className="feature-title">E-2 Proportionality Test</h3>
              <p className="feature-desc">
                Implements the inverted sliding scale. Service-startup exceptions, 
                5-year hiring plan analysis, and marginality assessment built in.
              </p>
            </div>
            <div className="card card-elevated card-hover feature-card">
              <div className="feature-icon">🏛</div>
              <h3 className="feature-title">LLC Self-Sponsorship</h3>
              <p className="feature-desc">
                2026 rule: your own LLC can petition for you. We evaluate governance, 
                employer-employee relationship, and recommend the best filing route.
              </p>
            </div>
            <div className="card card-elevated card-hover feature-card">
              <div className="feature-icon">📋</div>
              <h3 className="feature-title">Document Intelligence</h3>
              <p className="feature-desc">
                Upload passports and resumes. Our extraction engine pulls name, DOB, 
                nationality, and work history — ready for AWS Textract in production.
              </p>
            </div>
            <div className="card card-elevated card-hover feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Criterion-Level Scoring</h3>
              <p className="feature-desc">
                Every criterion scored 0-100 with evidence summaries and specific 
                recommendations to strengthen your weakest areas.
              </p>
            </div>
            <div className="card card-elevated card-hover feature-card">
              <div className="feature-icon">🔐</div>
              <h3 className="feature-title">Secure by Design</h3>
              <p className="feature-desc">
                JWT + Argon2 authentication. PostgreSQL JSONB versioned profiles. 
                Future-ready for S3 encryption. Your data stays protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" id="how-it-works" style={{ background: "var(--bg-white)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Process</div>
            <h2 className="section-title">Three steps to clarity</h2>
            <p className="section-subtitle">
              From sign-up to a scored eligibility report in under 15 minutes.
            </p>
          </div>

          <div className="grid grid-3 stagger">
            <div className="card feature-card" style={{ borderTop: "3px solid var(--accent-black)" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-4xl)", fontWeight: 700, color: "var(--bg-muted)", marginBottom: "var(--space-4)" }}>01</div>
              <h3 className="feature-title">Create your profile</h3>
              <p className="feature-desc">
                Sign up, pick O-1A or E-2, and let our adaptive questionnaire guide 
                you through only the questions that matter for your case.
              </p>
            </div>
            <div className="card feature-card" style={{ borderTop: "3px solid var(--accent-black)" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-4xl)", fontWeight: 700, color: "var(--bg-muted)", marginBottom: "var(--space-4)" }}>02</div>
              <h3 className="feature-title">Complete assessment</h3>
              <p className="feature-desc">
                Our Zen Mode interface walks you through 10 focused steps. Auto-save 
                keeps your progress safe — come back anytime.
              </p>
            </div>
            <div className="card feature-card" style={{ borderTop: "3px solid var(--accent-black)" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-4xl)", fontWeight: 700, color: "var(--bg-muted)", marginBottom: "var(--space-4)" }}>03</div>
              <h3 className="feature-title">Get your results</h3>
              <p className="feature-desc">
                Instant eligibility score with per-criterion breakdowns, evidence 
                gaps, and actionable next steps to strengthen your case.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container">
          <div className="card card-elevated" style={{
            padding: "var(--space-20) var(--space-12)",
            background: "var(--accent-black)",
            color: "var(--text-inverse)",
            border: "none",
            borderRadius: "var(--radius-xl)",
            maxWidth: 800,
            margin: "0 auto",
          }}>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-3xl)",
              fontWeight: 700,
              marginBottom: "var(--space-4)",
              lineHeight: 1.15,
            }}>
              Ready to find out where you stand?
            </h2>
            <p style={{
              fontSize: "var(--text-lg)",
              opacity: 0.6,
              marginBottom: "var(--space-8)",
              maxWidth: 440,
              margin: "0 auto var(--space-8)",
              lineHeight: 1.7,
            }}>
              No credit card. No paywall. Start your free assessment now.
            </p>
            <Link
              href="/register"
              className="btn btn-lg"
              style={{ background: "white", color: "var(--accent-black)", fontWeight: 600 }}
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="nav-logo">
              <span className="nav-logo-mark">V</span>
              VisaOS
            </div>
            <div className="footer-text">
              © 2026 VisaOS. All rights reserved.
            </div>
          </div>
          <p className="footer-disclaimer">
            This platform provides informational assessment only and does not constitute legal advice.
            Immigration laws are complex and subject to change. Always consult with a qualified
            immigration attorney before filing any visa petition.
          </p>
        </div>
      </footer>
    </>
  );
}
