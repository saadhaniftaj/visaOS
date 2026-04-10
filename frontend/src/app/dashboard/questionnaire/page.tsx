"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfile, updateStep, createProfile } from "@/lib/api";
import { STEPS, StepConfig, FieldConfig } from "@/lib/constants";

function QuestionnaireContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get("profile");

  const [profileId, setProfileId] = useState<string | null>(profileIdParam);
  const [visaCategory, setVisaCategory] = useState<string>("O1A");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, Record<string, unknown>>>({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  const fetchProfile = useCallback(async () => {
    if (!profileIdParam) return;
    try {
      const profile = await getProfile(profileIdParam);
      setProfileId(profile.id);
      setVisaCategory(profile.visa_category);
      setCurrentStep(Math.min(profile.questionnaire_step, 10));
      if (profile.questionnaire_data) {
        setFormData(profile.questionnaire_data as Record<string, Record<string, unknown>>);
      }
    } catch (err) { console.error("Failed to load profile:", err); }
  }, [profileIdParam]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    const createNew = async () => {
      if (!profileIdParam && !profileId) {
        try { const p = await createProfile("O1A"); setProfileId(p.id); }
        catch (err) { console.error("Failed:", err); }
      }
    };
    createNew();
  }, [profileIdParam, profileId]);

  const applicableSteps = STEPS.filter(s => s.category === "all" || s.category === visaCategory);

  const currentConfig: StepConfig | undefined = applicableSteps.find(s => s.id === currentStep);
  if (!currentConfig) {
    const next = applicableSteps.find(s => s.id >= currentStep) || applicableSteps[applicableSteps.length - 1];
    if (next && next.id !== currentStep) setCurrentStep(next.id);
  }

  const stepKey = `step_${currentStep}`;
  const currentFormData = (formData[stepKey] || {}) as Record<string, string | number>;

  const handleFieldChange = (name: string, value: string | number) => {
    const updated = { ...formData };
    if (!updated[stepKey]) updated[stepKey] = {};
    (updated[stepKey] as Record<string, string | number>)[name] = value;
    setFormData(updated);
    if (currentStep === 2 && name === "visa_type" && (value === "O1A" || value === "E2")) {
      setVisaCategory(value);
    }
  };

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    setSaveStatus("");
    try {
      await updateStep(profileId, currentStep, formData[stepKey] || {});
      setSaveStatus("✓ Saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      setSaveStatus("Failed to save");
      console.error(err);
    } finally { setSaving(false); }
  };

  const goNext = async () => {
    await handleSave();
    const idx = applicableSteps.findIndex(s => s.id === currentStep);
    if (idx < applicableSteps.length - 1) {
      setCurrentStep(applicableSteps[idx + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(`/dashboard/results?profile=${profileId}`);
    }
  };

  const goPrev = () => {
    const idx = applicableSteps.findIndex(s => s.id === currentStep);
    if (idx > 0) { setCurrentStep(applicableSteps[idx - 1].id); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const stepIdx = applicableSteps.findIndex(s => s.id === currentStep);
  const isLast = stepIdx === applicableSteps.length - 1;

  const renderField = (field: FieldConfig) => {
    const value = currentFormData[field.name] ?? "";
    return (
      <div className="input-group" key={field.name}>
        <label htmlFor={`field-${field.name}`}>
          {field.label}
          {field.required && <span style={{ color: "var(--accent-red)", marginLeft: 4 }}>*</span>}
        </label>
        {field.type === "select" ? (
          <select id={`field-${field.name}`} className="input" value={String(value)}
            onChange={e => handleFieldChange(field.name, e.target.value)}>
            {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : field.type === "textarea" ? (
          <textarea id={`field-${field.name}`} className="input" placeholder={field.placeholder}
            value={String(value)} onChange={e => handleFieldChange(field.name, e.target.value)} rows={5} />
        ) : (
          <input id={`field-${field.name}`} type={field.type} className="input" placeholder={field.placeholder}
            value={String(value)}
            onChange={e => handleFieldChange(field.name, field.type === "number" ? Number(e.target.value) || 0 : e.target.value)} />
        )}
      </div>
    );
  };

  const displayConfig = currentConfig || applicableSteps[0];

  return (
    <div className="zen-wrapper">
      {/* Step Indicator */}
      <div className="step-indicator">
        {applicableSteps.map((step, i) => {
          let cls = "step-dot";
          if (i < stepIdx) cls += " completed";
          if (i === stepIdx) cls += " active";
          return <div key={step.id} className={cls} />;
        })}
      </div>

      {/* Zen Card */}
      <div className="card card-elevated animate-slide-up" style={{ padding: "var(--space-10)" }}>
        <div className="zen-header">
          <div className="zen-step-label">Step {stepIdx + 1} of {applicableSteps.length}</div>
          <h2 className="zen-title">{displayConfig.title}</h2>
          <p className="zen-description">{displayConfig.description}</p>
        </div>

        <div className="zen-form" key={currentStep}>
          {displayConfig.fields.map(f => renderField(f))}
        </div>
      </div>

      {/* Actions outside card */}
      <div className="zen-actions">
        <button className="btn btn-secondary" onClick={goPrev} disabled={stepIdx === 0}>
          ← Previous
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {saveStatus && (
            <span style={{ fontSize: "var(--text-xs)", color: saveStatus.includes("✓") ? "var(--accent-emerald)" : "var(--accent-red)" }}>
              {saveStatus}
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="btn btn-primary" onClick={goNext} disabled={saving}>
            {isLast ? "Submit & Evaluate →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={
      <div className="zen-wrapper" style={{ textAlign: "center", padding: "var(--space-20)" }}>
        <div className="spinner" style={{ margin: "0 auto" }} />
      </div>
    }>
      <QuestionnaireContent />
    </Suspense>
  );
}
