import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api";
import UptimeStatus from "../components/common/UptimeStatus";
import { Users, FileText, Activity, TrendingUp, BarChart2, Plus, Radio, Clock, Eye, AlertCircle, Send, Inbox, ShieldAlert, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, Legend } from "recharts";

const StatCard = ({ label, value, icon: Icon, color, subLabel, subColor }) => (
  <div className="glass-panel stat-card" style={{ padding: "1.5rem", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>{label}</div>
      <div style={{ color, padding: "0.5rem", background: `${color}15`, borderRadius: "8px" }}>
        <Icon size={20} />
      </div>
    </div>
    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{value ?? "-"}</div>
    {subLabel && (
      <div style={{ fontSize: "0.75rem", color: subColor || "var(--text-muted)", fontWeight: 500 }}>
        {subLabel}
      </div>
    )}
  </div>
);

const QuickPublishWidget = ({ onPublished }) => {
  const [form, setForm] = useState({ titleTa: "", titleEn: "", categoryId: "", isBreaking: false });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get("/admin/taxonomy/categories").then(r => setCategories(r.data || [])).catch(() => {
      // Fallback to public endpoint
      api.get("/categories").then(r => setCategories(r.data || [])).catch(() => {});
    });
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!form.titleTa || !form.categoryId) {
      setMsg({ text: "Title and Category required.", err: true });
      setTimeout(() => setMsg(null), 3000);
      return;
    }
    setLoading(true);
    try {
      await api.post("/articles", { ...form, contentTa: "", status: "published" });
      if (form.isBreaking) {
        const expiresAt = new Date(Date.now() + 6 * 3600000).toISOString();
        await api.post("/breaking-news", { titleTa: form.titleTa, titleEn: form.titleEn, isActive: true, expiresAt, priority: "HIGH" });
      }
      setMsg({ text: "Article published live!", err: false });
      setForm({ titleTa: "", titleEn: "", categoryId: "", isBreaking: false });
      if (onPublished) onPublished();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ text: "Publish failed.", err: true });
      setTimeout(() => setMsg(null), 3000);
    }
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.8rem", boxSizing: "border-box" };

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "12px", border: "2px solid var(--primary)" }}>
      <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)" }}><Send size={16} /> Quick Publish</h3>
      <form onSubmit={handlePublish} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input style={inputStyle} placeholder="Tamil Headline *" value={form.titleTa} onChange={e => setForm(f => ({ ...f, titleTa: e.target.value }))} />
        <input style={inputStyle} placeholder="English Headline (optional)" value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} />
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <select style={{ ...inputStyle, flex: 1 }} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
            <option value="">— Select Category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", cursor: "pointer", color: form.isBreaking ? "#EF4444" : "var(--text-secondary)", fontWeight: form.isBreaking ? 700 : 400 }}>
            <input type="checkbox" checked={form.isBreaking} onChange={e => setForm(f => ({ ...f, isBreaking: e.target.checked }))} style={{ accentColor: "#EF4444" }} />
            Breaking
          </label>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", padding: "0.6rem", background: form.isBreaking ? "#EF4444" : "var(--primary)", border: "none" }}>
          {loading ? "Publishing..." : <><Plus size={16} /> Publish Now</>}
        </button>
        {msg && <div style={{ fontSize: "0.75rem", color: msg.err ? "#EF4444" : "#10B981", textAlign: "center", fontWeight: 600 }}>{msg.text}</div>}
      </form>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [newsPerf, setNewsPerf] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [counts, setCounts] = useState({ pendingArticles: 0, pendingUgc: 0, activeBreaking: 0, pendingProfanity: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [kpiRes, perfRes, catRes, logsRes, countsRes] = await Promise.allSettled([
        api.get("/admin/analytics/dashboard"),
        api.get("/admin/analytics/news-performance"),
        api.get("/admin/analytics/content-by-category"),
        api.get("/admin/audit-logs?page=0&size=6&sortBy=timestamp&direction=desc"),
        api.get("/admin/sidebar/counts")
      ]);
      if (kpiRes.status === "fulfilled") setKpis(kpiRes.value.data);
      if (perfRes.status === "fulfilled") setNewsPerf(perfRes.value.data);
      if (catRes.status === "fulfilled") setCategoryData(catRes.value.data || []);
      if (logsRes.status === "fulfilled") setRecentLogs(Array.isArray(logsRes.value.data) ? logsRes.value.data : (logsRes.value.data?.content || []));
      if (countsRes.status === "fulfilled") setCounts(countsRes.value.data || {});
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const topCategoryData = [...categoryData]
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 7);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Newsroom Command Center</h1>
          <p className="text-secondary">Welcome back, <strong>{user?.email?.split("@")[0]}</strong> · <span style={{ color: "var(--primary)", fontWeight: 'bold' }}>{user?.role?.replace(/_/g, " ")}</span></p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <NavLink to="/admin/news/create" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={16} /> Write Article</NavLink>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          <Activity size={32} style={{ margin: "0 auto 1rem", display: "block", opacity: 0.4 }} className="animate-pulse" />
          Loading dashboard data…
        </div>
      ) : (
        <>
          {/* KPI Stat Cards Grid */}
          <div className="stats-grid">
            <StatCard label="Total Views" value={newsPerf?.totalViews?.toLocaleString() || "0"} icon={Eye} color="#3B82F6" subLabel="Total video & article views" />
            <StatCard label="Published News" value={newsPerf?.publishedCount?.toLocaleString() || "0"} icon={FileText} color="var(--primary)" subLabel="Articles live on portal" />
            <StatCard label="Pending Review" value={counts.pendingArticles || "0"} icon={Inbox} color="#F59E0B" subLabel="Submitted for approval" />
            <StatCard label="Active Authors" value={kpis?.activeUsers || "0"} icon={Users} color="#10B981" subLabel="Content creators online" />
          </div>

          {/* Charts & Graphs Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
            {/* Category Performance Chart */}
            <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", minHeight: "350px" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}><TrendingUp size={18} color="var(--primary)" /> Category Traffic Distribution</h3>
              <div style={{ width: "100%", height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={topCategoryData}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="categoryName" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="totalViews" stroke="var(--primary)" fillOpacity={1} fill="url(#viewsGrad)" name="Views" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Articles Count per Category Chart */}
            <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", minHeight: "350px" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}><BarChart2 size={18} color="#3B82F6" /> Articles by Category</h3>
              <div style={{ width: "100%", height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="categoryName" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Bar dataKey="articleCount" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Articles" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
            {/* Status Board */}
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Activity size={18} color="var(--primary)" /> Editorial Status Board</h3>
                <NavLink to="/admin/editorial-calendar" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none" }}>View Calendar →</NavLink>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {[
                  { label: "Pending Reviews", value: counts.pendingArticles || 0, color: "#F59E0B", desc: "Awaiting approval", link: "/admin/news?status=pending" },
                  { label: "UGC Submissions", value: counts.pendingUgc || 0, color: "#8B5CF6", desc: "Citizen reports queue", link: "/admin/crowd-reporter" },
                  { label: "Active Breaking", value: counts.activeBreaking || 0, color: "#EF4444", desc: "Currently live tickers", link: "/admin/breaking-news" }
                ].map(s => (
                  <div
                    key={s.label}
                    onClick={() => navigate(s.link)}
                    style={{ padding: "1rem", borderRadius: "10px", background: `${s.color}11`, border: `1px solid ${s.color}33`, textAlign: "center", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = `0 4px 16px ${s.color}44`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color, marginBottom: "0.25rem" }}>{s.value}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.label}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{s.desc}</div>
                    <div style={{ fontSize: "0.7rem", color: s.color, marginTop: "0.4rem", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>View <ChevronRight size={10} /></div>
                  </div>
                ))}
              </div>
              
              <h4 style={{ marginTop: "2rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>🔥 Top Performing Articles</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(newsPerf?.topArticles?.slice(0, 4) || []).map((art, i) => (
                  <div key={art.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ width: "24px", height: "24px", background: i === 0 ? "#F59E0B" : i === 1 ? "#9CA3AF" : i === 2 ? "#D97706" : "var(--border-color)", color: i < 3 ? "#fff" : "var(--text-muted)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art.title || art.titleTa || `Article #${art.id}`}</div>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700 }}>{(art.views || 0).toLocaleString()} <Eye size={12} style={{ display: "inline", marginLeft: '2px' }}/></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Widget / Tags */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <UptimeStatus />
              <QuickPublishWidget onPublished={fetchAll} />

              <div className="glass-panel" style={{ padding: "1.25rem" }}>
                <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><TrendingUp size={16} /> Platform Alerts</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {counts.pendingProfanity > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '8px', color: '#EF4444', fontSize: '0.8rem' }}>
                      <ShieldAlert size={16} />
                      <span>{counts.pendingProfanity} violations need moderate review</span>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>No current platform violations.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Clock size={18} /> Recent Newsroom Activity</h3>
              <NavLink to="/admin/audit-logs" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none" }}>View All Logs →</NavLink>
            </div>
            {recentLogs.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "1rem" }}>No recent activity.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {recentLogs.map((log, i) => (
                  <div key={log.id || i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", marginTop: "6px", flexShrink: 0, background: log.action?.includes("DELETE") ? "#EF4444" : log.action?.includes("CREATE") ? "#10B981" : "var(--primary)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}><strong>{log.userEmail || log.username || "System"}</strong> {log.action || log.module}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
