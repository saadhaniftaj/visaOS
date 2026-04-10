"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listProfiles, createProfile } from "@/lib/api";

interface Profile {
  id: string;
  visa_category: string;
  version: number;
  questionnaire_step: number;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchProfiles(); }, []);

  const fetchProfiles = async () => {
    try { const d = await listProfiles(); setProfiles(d.profiles); }
    catch (e) { console.error("Failed to load profiles:", e); }
    finally { setLoading(false); }
  };

  const handleCreate = async (cat: string) => {
    setCreating(true);
    try { await createProfile(cat); await fetchProfiles(); }
    catch (e) { console.error("Failed:", e); }
    finally { setCreating(false); }
  };

  const categoryLabel = (c: string) =>
    c === "O1A" ? "O-1A Extraordinary Ability" : c === "E2" ? "E-2 Treaty Investor" : c;

  const progress = (step: number) => Math.min(step * 10, 100);

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid stagger">
        <div className="card card-elevated stat-card">
          <div className="stat-card-label">Active Profiles</div>
          <div className="stat-card-value">{profiles.length}</div>
          <div className="stat-card-meta"><span>↗</span> All time</div>
        </div>
        <div className="card card-elevated stat-card">
          <div className="stat-card-label">Completed</div>
          <div className="stat-card-value">{profiles.filter(p => p.is_complete).length}</div>
          <div className="stat-card-meta"><span>✓</span> Ready for evaluation</div>
        </div>
        <div className="card card-elevated stat-card">
          <div className="stat-card-label">Engine</div>
          <div className="stat-card-value" style={{ fontSize: "var(--text-xl)" }}>2026.1</div>
          <div className="stat-card-meta"><span>⚡</span> Latest standards</div>
        </div>
        <div className="card card-elevated stat-card">
          <div className="stat-card-label">Plan</div>
          <div className="stat-card-value" style={{ fontSize: "var(--text-xl)" }}>Free</div>
          <div className="stat-card-meta"><span>∞</span> All features</div>
        </div>
      </div>

      {/* New Assessment */}
      <div style={{ marginBottom: "var(--space-10)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-5)" }}>
          Start New Assessment
        </h2>
        <div className="grid grid-2">
          <button
            className="card card-elevated card-hover"
            onClick={() => handleCreate("O1A")}
            disabled={creating}
            style={{ cursor: "pointer", textAlign: "left", width: "100%" }}
            id="create-o1a"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
              <span className="badge badge-black">O-1A</span>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Extraordinary Ability</span>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              For tech/business professionals with extraordinary achievements. 
              Evaluates 8 criteria with 2026 digital updates.
            </p>
          </button>

          <button
            className="card card-elevated card-hover"
            onClick={() => handleCreate("E2")}
            disabled={creating}
            style={{ cursor: "pointer", textAlign: "left", width: "100%" }}
            id="create-e2"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
              <span className="badge badge-black">E-2</span>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Treaty Investor</span>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              For investors directing substantial investment in a US enterprise. 
              Proportionality, marginality, and 5-year plan analysis.
            </p>
          </button>
        </div>
      </div>

      {/* Profiles */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-5)" }}>
        Your Profiles
      </h2>

      {loading ? (
        <div className="grid grid-2">
          {[1, 2].map(i => (
            <div key={i} className="card" style={{ height: 180 }}>
              <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, width: "80%", marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 6, width: "100%", borderRadius: 9999, marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 14, width: "35%" }} />
            </div>
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="card card-elevated" style={{ textAlign: "center", padding: "var(--space-16)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>📋</div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
            No profiles yet
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Create your first profile above to begin.
          </p>
        </div>
      ) : (
        <div className="grid grid-2 stagger">
          {profiles.map(p => (
            <div key={p.id} className="card card-elevated card-hover">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                <div>
                  <span className="badge badge-black" style={{ marginBottom: "var(--space-2)", display: "inline-block" }}>
                    {p.visa_category}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-sm)", fontWeight: 600, marginTop: "var(--space-2)" }}>
                    {categoryLabel(p.visa_category)}
                  </h3>
                </div>
                {p.is_complete ? (
                  <span className="badge badge-emerald">Complete</span>
                ) : (
                  <span className="badge badge-gold">In Progress</span>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: "var(--space-4)" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginBottom: 6
                }}>
                  <span>Step {Math.min(p.questionnaire_step, 10)}/10</span>
                  <span>{progress(p.questionnaire_step)}%</span>
                </div>
                <div style={{
                  height: 4, background: "var(--bg-muted)",
                  borderRadius: "var(--radius-full)", overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${progress(p.questionnaire_step)}%`,
                    background: p.is_complete ? "var(--accent-emerald)" : "var(--accent-black)",
                    borderRadius: "var(--radius-full)",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                {p.is_complete ? (
                  <Link href={`/dashboard/results?profile=${p.id}`} className="btn btn-primary btn-sm">
                    View Results
                  </Link>
                ) : (
                  <Link href={`/dashboard/questionnaire?profile=${p.id}`} className="btn btn-primary btn-sm">
                    Continue
                  </Link>
                )}
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginLeft: "auto" }}>
                  v{p.version} · {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
