import React, { useState, useEffect } from "react";
import api from "../../api";
import { DollarSign, Plus, Eye, EyeOff, Trash2, Edit2, BarChart2 } from "lucide-react";
import ImageUploadPreview from "../../components/common/ImageUploadPreview";
import DatePickerInput from "../../components/common/DatePickerInput";

const AD_POSITIONS = [
  { value: "header", label: "Header" },
  { value: "footer", label: "Footer" },
  { value: "sidebar", label: "Sidebar" },
  { value: "in-content-after-paragraph-3", label: "In-Content After Paragraph 3" },
  { value: "in-content-after-paragraph-7", label: "In-Content After Paragraph 7" },
  { value: "mobile-sticky", label: "Mobile Sticky" },
  { value: "interstitial", label: "Interstitial" },
  { value: "video-pre-roll", label: "Video Pre-roll" },
];

const AD_TYPE_COLORS = { header:"#3B82F6", footer:"#3B82F6", sidebar:"#8B5CF6", "in-content-after-paragraph-3":"#F59E0B", "in-content-after-paragraph-7":"#F59E0B", "mobile-sticky":"#EF4444", interstitial:"#EC4899", "video-pre-roll":"#10B981" };

const inputStyle = { width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" };
const labelStyle = { fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem", display: "block" };

const AdManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [form, setForm] = useState({ name: "", position: "header", type: "IMAGE", imageUrl: "", adCode: "", targetUrl: "", startDate: "", endDate: "", targetDevice: "all", targetGeo: "all", isActive: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [filterPosition, setFilterPosition] = useState("ALL");
  const [recentArticles, setRecentArticles] = useState([]);

  const showMsg = (text, isError = false) => { setMsg({ text, isError }); setTimeout(() => setMsg(null), 4000); };

  useEffect(() => {
    api.get("/advertisements/getAll?page=0&size=50")
      .then(r => setAds(Array.isArray(r.data) ? r.data : (r.data?.content || [])))
      .catch(() => setAds([]))
      .finally(() => setLoading(false));

    api.get("/articles?status=published")
      .then(r => setRecentArticles(r.data.slice(0, 30) || []))
      .catch(err => console.warn("Failed to load articles for ad targeting", err));
  }, []);

  const openEdit = (ad) => {
    setEditingAd(ad);
    setForm({ name: ad.title || ad.name || "", position: ad.placement || ad.position || "header", type: ad.type || "IMAGE", imageUrl: ad.imageUrl || "", adCode: ad.adCode || ad.scriptCode || "", targetUrl: ad.targetUrl || ad.linkUrl || "", startDate: ad.startDate ? ad.startDate.slice(0,10) : "", endDate: ad.endDate ? ad.endDate.slice(0,10) : "", targetDevice: ad.targetDevice || ad.device || "all", targetGeo: ad.targetGeo || "all", isActive: ad.status === "active" || ad.isActive !== false });
    setShowForm(true);
  };

  const resetForm = () => { setForm({ name: "", position: "header", type: "IMAGE", imageUrl: "", adCode: "", targetUrl: "", startDate: "", endDate: "", targetDevice: "all", targetGeo: "all", isActive: true }); setEditingAd(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.position) { showMsg("Ad name and position are required.", true); return; }
    setSaving(true);
    try {
      const payload = {
        id: editingAd ? editingAd.id : undefined,
        title: form.name,
        placement: form.position,
        type: form.type,
        imageUrl: form.imageUrl,
        linkUrl: form.targetUrl,
        adCode: form.adCode,
        startDate: form.startDate,
        endDate: form.endDate,
        targetDevice: form.targetDevice,
        targetGeo: form.targetGeo,
        status: form.isActive ? "active" : "inactive"
      };
      
      if (editingAd) {
        const res = await api.put(`/advertisements/${editingAd.id}`, payload);
        setAds(prev => prev.map(a => a.id === editingAd.id ? res.data : a));
        showMsg("Ad updated successfully!");
      } else {
        const res = await api.post("/advertisements", payload);
        setAds(prev => [...prev, res.data]);
        showMsg("Ad created successfully!");
      }
      resetForm(); setShowForm(false);
    } catch (err) { showMsg(err.response?.data?.message || "Failed to save ad.", true); }
    setSaving(false);
  };

  const toggleActive = async (ad) => {
    try {
      const newStatus = (ad.status === "active" || ad.isActive !== false) ? "inactive" : "active";
      await api.patch(`/advertisements/changeStatus`, { id: ad.id, status: newStatus });
      setAds(prev => prev.map(a => a.id === ad.id ? { ...a, status: newStatus, isActive: newStatus === "active" } : a));
      showMsg(`Ad ${newStatus === "active" ? "activated" : "deactivated"}.`);
    } catch { showMsg("Failed to toggle.", true); }
  };

  const deleteAd = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    try { await api.delete(`/advertisements/${id}`); setAds(prev => prev.filter(a => a.id !== id)); showMsg("Deleted."); }
    catch { showMsg("Failed to delete.", true); }
  };

  const filteredAds = filterPosition === "ALL" ? ads : ads.filter(a => a.position === filterPosition);
  const activeCount = ads.filter(a => a.status === "active" || a.isActive !== false).length;
  const positionStats = {};
  AD_POSITIONS.forEach(p => { positionStats[p.value] = ads.filter(a => (a.placement === p.value || a.position === p.value) && (a.status === "active" || a.isActive !== false)).length; });

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <DollarSign size={26} color="var(--primary)" /> Ad Management
          </h1>
          <p className="text-secondary">Manage all advertisement placements across the platform.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} /> {showForm && !editingAd ? "Cancel" : "New Ad"}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Ads", value: ads.length, color: "var(--primary)", bg: "var(--primary-glow)" },
          { label: "Active Ads", value: activeCount, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
          { label: "Inactive", value: ads.length - activeCount, color: "var(--text-muted)", bg: "var(--bg-secondary)" },
          { label: "Positions Used", value: Object.keys(positionStats).filter(k => positionStats[k] > 0).length, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="glass-panel" style={{ padding: "1.1rem 1.25rem" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Ad Slot Map */}
      <div className="glass-panel" style={{ padding: "1.25rem", marginBottom: "2rem", borderRadius: "12px" }}>
        <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><BarChart2 size={18} /> Ad Slot Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem" }}>
          {AD_POSITIONS.map(p => (
            <div key={p.value} onClick={() => setFilterPosition(filterPosition === p.value ? "ALL" : p.value)}
              style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", cursor: "pointer", transition: "all 0.15s",
                background: filterPosition === p.value ? `${AD_TYPE_COLORS[p.value]}22` : "var(--bg-secondary)",
                border: `1px solid ${filterPosition === p.value ? AD_TYPE_COLORS[p.value] : "var(--border-color)"}` }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: AD_TYPE_COLORS[p.value], marginBottom: "2px" }}>{positionStats[p.value] || 0} active</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      {msg && (
        <div style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem",
          background: msg.isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          color: msg.isError ? "#EF4444" : "#10B981",
          border: `1px solid ${msg.isError ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}` }}>{msg.text}</div>
      )}

      {/* Form */}
      {showForm && (
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "14px", border: "2px solid var(--primary)", marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1.25rem", color: "var(--primary)" }}>{editingAd ? "✏️ Edit Ad" : "➕ Create New Ad"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label style={labelStyle}>Ad Name *</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Diwali Banner - Top" /></div>
              <div><label style={labelStyle}>Position *</label>
                <select style={inputStyle} value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}>
                  {AD_POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div><label style={labelStyle}>Ad Type</label>
                <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="IMAGE">🖼️ Image Ad</option>
                  <option value="VIDEO">🎥 Video Ad</option>
                  <option value="HTML_CODE">💻 HTML/JS Code</option>
                  <option value="ADSENSE">💲 Google AdSense</option>
                </select>
              </div>
              <div><label style={labelStyle}>Device Target</label>
                <select style={inputStyle} value={form.targetDevice} onChange={e => setForm(f => ({ ...f, targetDevice: e.target.value }))}>
                  <option value="all">All Devices</option>
                  <option value="desktop">Desktop Only</option>
                  <option value="mobile">Mobile Only</option>
                </select>
              </div>
              <div><label style={labelStyle}>Status</label>
                <select style={inputStyle} value={form.isActive ? "true" : "false"} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === "true" }))}>
                  <option value="true">✅ Active</option>
                  <option value="false">❌ Inactive</option>
                </select>
              </div>
            </div>
            {(form.type === "IMAGE" || form.type === "VIDEO") && (
              <ImageUploadPreview
                label={form.type === "IMAGE" ? "Ad Creative Image" : "Video URL or Upload"}
                value={form.imageUrl}
                onChange={val => setForm(f => ({ ...f, imageUrl: val }))}
                uploadEndpoint="/articles/upload"
                placeholder={form.type === "IMAGE" ? "Image URL or upload ad banner..." : "Video URL (mp4) or upload..."}
                isVideo={form.type === "VIDEO"}
              />
            )}
            {form.type === "HTML_CODE" && <div><label style={labelStyle}>Ad HTML/JS Code</label><textarea value={form.adCode} onChange={e => setForm(f => ({ ...f, adCode: e.target.value }))} style={{ ...inputStyle, minHeight: "120px", resize: "vertical", fontFamily: "monospace" }} placeholder="<script>..." /></div>}
            <div>
              <label style={labelStyle}>Click Target URL</label>
              <input 
                style={inputStyle} 
                list="target-url-options"
                value={form.targetUrl} 
                onChange={e => setForm(f => ({ ...f, targetUrl: e.target.value }))} 
                placeholder="https://advertiser-website.com or select content" 
              />
              <datalist id="target-url-options">
                <option value="/category/politics">Category: Politics</option>
                <option value="/category/business">Category: Business</option>
                <option value="/category/sports">Category: Sports</option>
                <option value="/category/cinema">Category: Cinema</option>
                <option value="/category/tech">Category: Technology</option>
                <option value="/directory">Directory</option>
                <option value="/jobs">Jobs</option>
                <option value="/classifieds">Classifieds</option>
                <option value="/obituaries">Obituaries</option>
                <option value="/wishes">Wishes</option>
                {recentArticles.map(a => (
                  <option key={a.id} value={`/article/${a.id}`}>Article: {a.title}</option>
                ))}
              </datalist>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <DatePickerInput 
                  label="Start Date" 
                  value={form.startDate} 
                  onChange={val => setForm(f => ({ ...f, startDate: val }))} 
                  placeholder="dd/mm/yyyy" 
                />
              </div>
              <div>
                <DatePickerInput 
                  label="End Date" 
                  value={form.endDate} 
                  onChange={val => setForm(f => ({ ...f, endDate: val }))} 
                  placeholder="dd/mm/yyyy" 
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Geo-Targeting (District/Category Name)</label>
              <input style={inputStyle} value={form.targetGeo} onChange={e => setForm(f => ({ ...f, targetGeo: e.target.value }))} placeholder="e.g. 'all' or 'chennai'" />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" disabled={saving} className="btn btn-primary">{saving ? "Saving..." : editingAd ? "Update Ad" : "Create Ad"}</button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Ad List */}
      {loading ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Loading ads...</div>
      ) : filteredAds.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "12px" }}>
          <DollarSign size={40} style={{ opacity: 0.3, display: "block", margin: "0 auto 1rem" }} />
          No ads found. Create your first ad above!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filteredAds.map(ad => (
            <div key={ad.id} className="glass-panel" style={{ padding: "1rem 1.25rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "1rem",
              borderLeft: `4px solid ${AD_TYPE_COLORS[ad.position] || "var(--primary)"}`, opacity: ad.isActive === false ? 0.6 : 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{ad.title || ad.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{ color: AD_TYPE_COLORS[ad.placement || ad.position] || "var(--primary)", fontWeight: 600 }}>{AD_POSITIONS.find(p => p.value === (ad.placement || ad.position))?.label || (ad.placement || ad.position)}</span>
                  {(ad.targetDevice || ad.device) && (ad.targetDevice || ad.device).toLowerCase() !== "all" && <span style={{ textTransform: 'capitalize' }}>📱 {(ad.targetDevice || ad.device)}</span>}
                  {ad.targetGeo && ad.targetGeo.toLowerCase() !== "all" && <span style={{ textTransform: 'capitalize' }}>📍 {ad.targetGeo}</span>}
                  {ad.endDate && <span>Expires: {ad.endDate.slice(0,10)}</span>}
                  {(ad.impressionCount || ad.impressions || 0) > 0 && <span>👁️ {(ad.impressionCount || ad.impressions).toLocaleString()} impressions</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => toggleActive(ad)} style={{ padding: "0.4rem 0.75rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem",
                  background: ad.isActive !== false ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: ad.isActive !== false ? "#10B981" : "#EF4444" }}>
                  {ad.isActive !== false ? <><Eye size={13} style={{ display: "inline", marginRight: "4px" }} />Active</> : <><EyeOff size={13} style={{ display: "inline", marginRight: "4px" }} />Off</>}
                </button>
                <button onClick={() => { openEdit(ad); setShowForm(true); }} style={{ padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-secondary)" }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => deleteAd(ad.id)} style={{ padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", color: "#EF4444", cursor: "pointer" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdManagement;
