import React, { useState, useEffect } from "react";
import api from "../../api";
import { Users, CheckCircle, XCircle, Eye, Filter, Clock, MapPin, Image } from "lucide-react";

const STATUS_COLORS = { pending: "#F59E0B", approved: "#10B981", rejected: "#EF4444" };

const UgcQueue = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const showMsg = (text, isError = false) => { setMsg({ text, isError }); setTimeout(() => setMsg(null), 4000); };

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/ugc?status=${filter}&page=0&size=50`)
      .then(r => setItems(Array.isArray(r.data) ? r.data : (r.data?.content || [])))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/ugc/${id}/approve`);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: "approved" } : i));
      showMsg("Submission approved and converted to draft article!");
      setSelected(null);
    } catch { showMsg("Failed to approve.", true); }
  };

  const handleReject = async (id) => {
    if (!rejectReason) { showMsg("Please provide a rejection reason.", true); return; }
    try {
      await api.put(`/admin/ugc/${id}/reject`, { reason: rejectReason });
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: "rejected" } : i));
      showMsg("Submission rejected.");
      setSelected(null);
      setRejectReason("");
    } catch { showMsg("Failed to reject.", true); }
  };

  const counts = { pending: items.filter(i => i.status === "pending" || !i.status).length, all: items.length };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <Users size={26} color="var(--primary)" /> Crowd Reporter Queue
          </h1>
          <p className="text-secondary">Review and approve crowd-sourced story submissions.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["pending","approved","rejected","all"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn ${filter === s ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem", textTransform: "capitalize" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {msg && (
        <div style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem",
          background: msg.isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          color: msg.isError ? "#EF4444" : "#10B981",
          border: `1px solid ${msg.isError ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}` }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 400px" : "1fr", gap: "1.5rem", alignItems: "start" }}>
        <div>
          {loading ? (
            <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Loading submissions...</div>
          ) : items.length === 0 ? (
            <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "12px" }}>
              <Users size={40} style={{ opacity: 0.3, display: "block", margin: "0 auto 1rem" }} />
              No {filter} submissions found.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {items.map(item => (
                <div key={item.id} className="glass-panel" onClick={() => setSelected(item)}
                  style={{ padding: "1.25rem", borderRadius: "10px", cursor: "pointer",
                    borderLeft: `4px solid ${STATUS_COLORS[item.status || "pending"]}`,
                    background: selected?.id === item.id ? "var(--primary-glow)" : "var(--bg-surface)",
                    transition: "all 0.15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{item.title || item.storyTitle || "Untitled"}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                        by <strong>{item.name || item.reporterName || "Anonymous"}</strong>
                        {item.location && <span> · <MapPin size={11} style={{ display: "inline" }} /> {item.location}</span>}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        {item.category && <span>?? {item.category}</span>}
                        {item.imageUrl && <span><Image size={11} style={{ display: "inline" }} /> Has Image</span>}
                        {item.submittedAt && <span><Clock size={11} style={{ display: "inline" }} /> {new Date(item.submittedAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "12px",
                      background: `${STATUS_COLORS[item.status || "pending"]}22`,
                      color: STATUS_COLORS[item.status || "pending"], textTransform: "capitalize" }}>
                      {item.status || "pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "14px", border: "2px solid var(--primary)", position: "sticky", top: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 700 }}>Story Review</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.25rem" }}>?</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
              <div><strong>Title:</strong> {selected.title || selected.storyTitle}</div>
              <div><strong>Reporter:</strong> {selected.name || selected.reporterName} {selected.location && `· ${selected.location}`}</div>
              {selected.storyText && (
                <div style={{ background: "var(--bg-secondary)", padding: "0.75rem", borderRadius: "8px", maxHeight: "200px", overflowY: "auto" }}>
                  {selected.storyText}
                </div>
              )}
              {selected.imageUrl && <img src={selected.imageUrl} alt="" style={{ width: "100%", borderRadius: "8px", maxHeight: "160px", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
              {selected.videoLink && <div><strong>Video:</strong> <a href={selected.videoLink} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>{selected.videoLink}</a></div>}
            </div>
            {(selected.status === "pending" || !selected.status) && (
              <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button onClick={() => handleApprove(selected.id)} className="btn btn-primary"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <CheckCircle size={16} /> Approve & Create Draft
                </button>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Rejection reason (required)..."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)",
                    color: "var(--text-primary)", fontSize: "0.85rem", minHeight: "80px", resize: "vertical", boxSizing: "border-box" }} />
                <button onClick={() => handleReject(selected.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    padding: "0.6rem", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)",
                    color: "#EF4444", cursor: "pointer", fontWeight: 600 }}>
                  <XCircle size={16} /> Reject Submission
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UgcQueue;
