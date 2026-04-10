"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { evaluateEligibility, getProfile } from "@/lib/api";

interface CriterionScore {
  criterion_id: string;
  criterion_name: string;
  score: number;
  met: boolean;
  evidence_summary: string;
  recommendations: string[];
}

interface EvaluationResult {
  id: string;
  profile_id: string;
  visa_category: string;
  overall_score: number;
  criteria_met: number;
  criteria_required: number;
  criteria_scores: CriterionScore[];
  recommendations: string[];
  llc_assessment: {
    eligible: boolean;
    entity_type: string;
    has_governance: boolean;
    employer_employee_relationship: boolean;
    recommendations: string[];
    alternative_route: string | null;
  } | null;
  engine_version: string;
  status: string;
  created_at: string;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile");

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileCategory, setProfileCategory] = useState("O1A");

  const runEvaluation = useCallback(async () => {
    if (!profileId) {
      setError("No profile selected. Go to Dashboard and select a profile.");
      setLoading(false);
      return;
    }
    try {
      const profile = await getProfile(profileId);
      setProfileCategory(profile.visa_category);
      if (!profile.is_complete) {
        setError("Please complete all questionnaire steps before evaluating.");
        setLoading(false);
        return;
      }
      const evalResult = await evaluateEligibility(profileId);
      setResult(evalResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally { setLoading(false); }
  }, [profileId]);

  useEffect(() => { runEvaluation(); }, [runEvaluation]);

  const barClass = (s: number) => s >= 60 ? "high" : s >= 30 ? "medium" : "low";
  const circumference = 2 * Math.PI * 80;
  const dashOffset = result ? circumference - (result.overall_score / 100) * circumference : circumference;

  if (loading) {
    return (
      <div className="results-wrapper" style={{ textAlign: "center", padding: "var(--space-20)" }}>
        <div className="spinner" style={{ margin: "0 auto var(--space-4)", width: 40, height: 40 }} />
        <p style={{ color: "var(--text-secondary)" }}>Running eligibility evaluation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-wrapper" style={{ textAlign: "center", padding: "var(--space-20)" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>⚠️</div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
          Unable to Evaluate
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>{error}</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="results-wrapper animate-in">
      {/* Score Card */}
      <div className="card card-elevated score-card">
        <div className="score-ring">
          <svg viewBox="0 0 180 180">
            <circle className="score-ring-bg" cx="90" cy="90" r="80" />
            <circle
              className={`score-ring-fill ${result.status}`}
              cx="90" cy="90" r="80"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="score-number">{Math.round(result.overall_score)}</div>
        </div>
        <div className="score-subtitle">
          {profileCategory === "O1A"
            ? `${result.criteria_met} of ${result.criteria_required} criteria met`
            : `${result.criteria_met} of ${result.criteria_required} requirements satisfied`}
        </div>
        <div className={`score-status ${result.status}`}>
          {result.status === "strong" && "Strong Case"}
          {result.status === "moderate" && "Moderate Case"}
          {result.status === "weak" && "Needs Strengthening"}
          {result.status === "insufficient" && "Insufficient Evidence"}
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: "var(--space-2)" }}>
          Engine v{result.engine_version} · {profileCategory === "O1A" ? "O-1A Extraordinary Ability" : "E-2 Treaty Investor"}
        </div>
      </div>

      {/* Criteria Breakdown */}
      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-5)" }}>
        Criteria Breakdown
      </h3>
      <div className="criteria-list stagger">
        {result.criteria_scores.map(cr => (
          <div key={cr.criterion_id} className="card card-elevated criterion-card">
            <div className="criterion-header">
              <span className="criterion-name">{cr.criterion_name}</span>
              <span className="criterion-score" style={{
                color: cr.score >= 60 ? "var(--accent-emerald)" : cr.score >= 30 ? "var(--accent-gold)" : "var(--accent-red)"
              }}>
                {Math.round(cr.score)}/100
              </span>
            </div>
            <div className="criterion-bar">
              <div className={`criterion-fill ${barClass(cr.score)}`} style={{ width: `${cr.score}%` }} />
            </div>
            <div className="criterion-summary">{cr.evidence_summary}</div>
            {cr.met && <div className="badge badge-emerald" style={{ marginTop: "var(--space-2)" }}>✓ Met</div>}
          </div>
        ))}
      </div>

      {/* LLC Assessment */}
      {result.llc_assessment && (
        <div style={{ marginTop: "var(--space-8)" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-5)" }}>
            LLC Self-Sponsorship
          </h3>
          <div className="card card-elevated" style={{ padding: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <span className={`badge ${result.llc_assessment.eligible ? "badge-emerald" : "badge-gold"}`}>
                {result.llc_assessment.eligible ? "Eligible" : "Needs Work"}
              </span>
              {result.llc_assessment.entity_type && <span className="badge badge-muted">{result.llc_assessment.entity_type}</span>}
              {result.llc_assessment.employer_employee_relationship && <span className="badge badge-emerald">Employer-Employee ✓</span>}
            </div>
            {result.llc_assessment.recommendations.map((rec, i) => (
              <div key={i} className="rec-item"><span className="rec-icon">→</span>{rec}</div>
            ))}
            {result.llc_assessment.alternative_route && (
              <div style={{
                marginTop: "var(--space-3)", padding: "var(--space-3) var(--space-4)",
                background: "var(--accent-blue-muted)", borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)", color: "var(--accent-blue)",
              }}>
                Alternative: Consider filing via a <strong>US Agent</strong> instead.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div style={{ marginTop: "var(--space-8)" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-5)" }}>
          Recommendations
        </h3>
        {result.recommendations.map((rec, i) => (
          <div key={i} className="rec-item"><span className="rec-icon">💡</span>{rec}</div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: "var(--space-12)", padding: "var(--space-5)",
        background: "var(--accent-gold-muted)", borderRadius: "var(--radius-md)",
        border: "1px solid rgba(238,155,0,0.15)",
        fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.7,
      }}>
        <strong style={{ color: "var(--accent-gold)" }}>⚠ Legal Disclaimer:</strong>{" "}
        This assessment is informational only. USCIS adjudications are case-by-case.
        Consult a qualified immigration attorney before filing. Engine: {result.engine_version}.
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="results-wrapper" style={{ textAlign: "center", padding: "var(--space-20)" }}>
        <div className="spinner" style={{ margin: "0 auto" }} />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
