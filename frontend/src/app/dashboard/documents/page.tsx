"use client";

import { useEffect, useState, useRef } from "react";
import { uploadDocument, listDocuments } from "@/lib/api";

interface DocumentItem {
  id: string;
  filename: string;
  extraction_status: string;
  extracted_data: Record<string, unknown> | null;
  created_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    try { setDocuments(await listDocuments()); }
    catch (e) { console.error("Failed:", e); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try { await uploadDocument(file); await fetchDocuments(); }
    catch (err: unknown) { setUploadError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: 4 }}>
            Document Intelligence
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Upload passports, resumes, and supporting documents for automated extraction.
          </p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} style={{ display: "none" }} id="file-upload" />
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <><span className="spinner" /> Uploading...</> : "↑ Upload Document"}
          </button>
        </div>
      </div>

      {uploadError && (
        <div style={{
          padding: "var(--space-3) var(--space-4)", background: "var(--accent-red-muted)",
          borderRadius: "var(--radius-md)", color: "var(--accent-red)", fontSize: "var(--text-sm)", marginBottom: "var(--space-6)",
        }}>{uploadError}</div>
      )}

      {/* Info */}
      <div className="card" style={{
        padding: "var(--space-4)", background: "var(--accent-blue-muted)",
        borderColor: "rgba(59,130,246,0.1)", marginBottom: "var(--space-8)", fontSize: "var(--text-sm)", color: "var(--text-secondary)",
      }}>
        <strong style={{ color: "var(--accent-blue)" }}>ℹ Simulated Extraction</strong><br />
        In this MVP, extraction is simulated. The service interface is ready for AWS Textract/Bedrock in production.
      </div>

      {loading ? (
        <div className="grid grid-2">
          {[1, 2].map(i => (
            <div key={i} className="card" style={{ height: 200 }}>
              <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 80, width: "100%" }} />
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="card card-elevated" style={{ textAlign: "center", padding: "var(--space-16)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>📁</div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
            No documents uploaded
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Upload a document to test the extraction engine.
          </p>
        </div>
      ) : (
        <div className="grid grid-2 stagger">
          {documents.map(doc => (
            <div key={doc.id} className="card card-elevated card-hover">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                <div>
                  <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{doc.filename}</h4>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                    {new Date(doc.created_at).toLocaleString()}
                  </span>
                </div>
                <span className={`badge ${doc.extraction_status === "completed" ? "badge-emerald" : "badge-gold"}`}>
                  {doc.extraction_status}
                </span>
              </div>
              {doc.extracted_data && (
                <div style={{
                  padding: "var(--space-3)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--text-secondary)",
                  whiteSpace: "pre-wrap", maxHeight: 200, overflow: "auto",
                }}>
                  {JSON.stringify(doc.extracted_data, null, 2)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
