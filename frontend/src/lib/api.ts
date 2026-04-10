/**
 * API client with JWT interceptor for the Vanguard Visa Platform backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("visa_access_token", token);
    }
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem("visa_access_token");
    }
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    return localStorage.getItem("visa_access_token");
  }
  return null;
}

async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    setAccessToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- Auth ----
export async function register(email: string, password: string, fullName: string) {
  const data = await apiFetch<{ access_token: string; expires_in: number }>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ email, password, full_name: fullName }),
    }
  );
  setAccessToken(data.access_token);
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiFetch<{ access_token: string; expires_in: number }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
  setAccessToken(data.access_token);
  return data;
}

export async function getMe() {
  return apiFetch<{
    id: string;
    email: string;
    full_name: string;
    subscription_tier: string;
    created_at: string;
  }>("/auth/me");
}

export function logout() {
  setAccessToken(null);
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// ---- Profiles ----
export async function createProfile(visaCategory: string) {
  return apiFetch<{
    id: string;
    visa_category: string;
    version: number;
    questionnaire_step: number;
    questionnaire_data: Record<string, unknown>;
  }>("/profiles/", {
    method: "POST",
    body: JSON.stringify({ visa_category: visaCategory }),
  });
}

export async function listProfiles() {
  return apiFetch<{
    profiles: Array<{
      id: string;
      visa_category: string;
      version: number;
      questionnaire_step: number;
      is_complete: boolean;
      created_at: string;
      updated_at: string;
    }>;
    total: number;
  }>("/profiles/");
}

export async function getProfile(profileId: string) {
  return apiFetch<{
    id: string;
    visa_category: string;
    version: number;
    questionnaire_data: Record<string, unknown>;
    questionnaire_step: number;
    is_complete: boolean;
  }>(`/profiles/${profileId}`);
}

export async function updateStep(profileId: string, step: number, data: Record<string, unknown>) {
  return apiFetch(`/profiles/${profileId}/step`, {
    method: "PUT",
    body: JSON.stringify({ step, data }),
  });
}

// ---- Eligibility ----
export async function evaluateEligibility(profileId: string) {
  return apiFetch<{
    id: string;
    profile_id: string;
    visa_category: string;
    overall_score: number;
    criteria_met: number;
    criteria_required: number;
    criteria_scores: Array<{
      criterion_id: string;
      criterion_name: string;
      score: number;
      met: boolean;
      evidence_summary: string;
      recommendations: string[];
    }>;
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
  }>("/eligibility/evaluate", {
    method: "POST",
    body: JSON.stringify({ profile_id: profileId }),
  });
}

export async function getResults(profileId: string) {
  return apiFetch<Array<{
    id: string;
    overall_score: number;
    criteria_scores: unknown[];
    recommendations: string[];
    engine_version: string;
    created_at: string;
  }>>(`/eligibility/results/${profileId}`);
}

// ---- Documents ----
export async function uploadDocument(file: File, profileId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (profileId) formData.append("profile_id", profileId);

  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(error.detail || "Upload failed");
  }

  return res.json();
}

export async function listDocuments() {
  return apiFetch<Array<{
    id: string;
    filename: string;
    extraction_status: string;
    extracted_data: Record<string, unknown>;
    created_at: string;
  }>>("/documents/");
}
