import React, { useState, useEffect } from "react";
import api from "../../api";
import { Check, X, FileText, Store, Shield, AlertCircle, RefreshCw } from "lucide-react";

const KycManagement = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadListings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/directory/getAll?size=100");
      if (res.data && res.data.content) {
        setListings(res.data.content);
      } else if (Array.isArray(res.data)) {
        setListings(res.data);
      } else {
        setListings([]);
      }
    } catch (err) {
      setError("Failed to fetch business directory listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleKycStatus = async (id, status) => {
    setError("");
    setSuccess("");
    try {
      await api.patch(`/directory/${id}/kyc`, { status });
      setSuccess(`Business directory listing successfully ${status}!`);
      loadListings();
    } catch (err) {
      setError("Failed to update business KYC status.");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield style={{ color: "#B3732A" }} /> Business KYC Verification Queue
          </h1>
          <p style={{ color: "var(--text-secondary)", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
            Review registered local businesses, inspect documents, and approve verification credentials.
          </p>
        </div>
        <button onClick={loadListings} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-primary)" }}>
          <RefreshCw size={14} /> Refresh Queue
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", padding: "0.75rem 1rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {success && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "0.75rem 1rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
          <Check size={16} /> {success}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <RefreshCw size={32} className="animate-spin" style={{ color: "#B3732A" }} />
          <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>Loading listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "4rem" }}>
          <Store size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
          <h3>No directory listings found</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Newly registered businesses requiring verification will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {listings.map((item) => (
            <div key={item.id} className="glass-panel" style={{ padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ background: "rgba(179, 115, 42, 0.1)", color: "#B3732A", width: "48px", height: "48px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Store size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{item.businessName}</h3>
                    <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem", flexWrap: "wrap" }}>
                      <span>Category: <strong>{item.category}</strong></span>
                      <span>Locality: <strong>{item.addressLocality}</strong></span>
                      <span>Phone: <strong>{item.phoneNumber}</strong></span>
                      <span>Owner ID: <strong>{item.createdBy}</strong></span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                    background: item.kycStatus === "approved" ? "rgba(16, 185, 129, 0.15)" : item.kycStatus === "rejected" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    color: item.kycStatus === "approved" ? "#10B981" : item.kycStatus === "rejected" ? "#EF4444" : "#F59E0B"
                  }}>
                    KYC: {item.kycStatus}
                  </span>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                    Registered: {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", padding: "10px 0 0 0", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FileText size={16} style={{ color: "var(--text-secondary)" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Document: <strong>{item.kycDocumentUrl || "No document uploaded"}</strong>
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {item.kycStatus !== "approved" && (
                    <button onClick={() => handleKycStatus(item.id, "approved")} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none", background: "#10B981", color: "white", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                      <Check size={14} /> Approve KYC
                    </button>
                  )}
                  {item.kycStatus !== "rejected" && (
                    <button onClick={() => handleKycStatus(item.id, "rejected")} className="btn-danger" style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none", background: "#EF4444", color: "white", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                      <X size={14} /> Reject KYC
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KycManagement;
