import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { TrendingUp, Users, Eye, Map, FileText, Download, Activity, CheckCircle2, Server } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend } from "recharts";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/dashboard');
      setStats(res.data);
    } catch (error) { 
      console.error("Failed to load analytics", error); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Poll stats every 10 seconds for concurrent stream variance
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const baseApi = api.defaults.baseURL || 'http://localhost:8080/api/v1';
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      
      const response = await fetch(`${baseApi}/analytics/report/pdf`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'kings_analytics_report.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  // Format charts data from backend
  const categoryChartData = stats?.categoryDistribution?.map(item => ({
    name: item.categoryNameEn,
    views: item.views,
    articles: item.articleCount
  })) || [
    { name: "Politics", views: 4000, articles: 12 },
    { name: "Business", views: 3000, articles: 8 },
    { name: "Cinema", views: 9800, articles: 15 },
    { name: "Sports", views: 2780, articles: 6 }
  ];

  const trendChartData = [
    { name: "Mon", views: 2400 },
    { name: "Tue", views: 1398 },
    { name: "Wed", views: 9800 },
    { name: "Thu", views: 3908 },
    { name: "Fri", views: 4800 },
    { name: "Sat", views: 3800 },
    { name: "Sun", views: 4300 },
  ];

  const totalPageViews = stats?.categoryDistribution?.reduce((acc, c) => acc + c.views, 0) || 12450;
  const totalArticlesCount = stats?.categoryDistribution?.reduce((acc, c) => acc + c.articleCount, 0) || 45;

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: '1rem' }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <TrendingUp size={26} color="var(--primary)" /> Reports & Analytics
          </h1>
          <p className="text-secondary">Platform performance, content metrics, and user growth.</p>
        </div>
        <button 
          onClick={handleDownloadReport} 
          disabled={downloading}
          className="btn btn-primary" 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem" }}
        >
          <Download size={16} />
          {downloading ? "Downloading..." : "Export Analytics Report"}
        </button>
      </div>

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Total Article Views</div>
            <div onClick={() => navigate('/admin/news')} style={{ color: "#3B82F6", padding: "0.5rem", background: "#3B82F622", borderRadius: "8px", cursor: "pointer", transition: "transform 0.15s" }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} title="View Articles"><Eye size={18} /></div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {loading ? "-" : totalPageViews.toLocaleString()}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Active Readers</div>
            <div onClick={() => navigate('/admin/users')} style={{ color: "#10B981", padding: "0.5rem", background: "#10B98122", borderRadius: "8px", cursor: "pointer", transition: "transform 0.15s" }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} title="View Readers"><Users size={18} /></div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {loading ? "-" : stats?.activeSessions}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Articles Published</div>
            <div onClick={() => navigate('/admin/news')} style={{ color: "var(--primary)", padding: "0.5rem", background: "var(--primary-light, #B3732A22)", borderRadius: "8px", cursor: "pointer", transition: "transform 0.15s" }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} title="View Published Articles"><FileText size={18} /></div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {loading ? "-" : totalArticlesCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Live TV Viewers</div>
            <div onClick={() => navigate('/admin/breaking-news')} style={{ color: "#EF4444", padding: "0.5rem", background: "#EF444422", borderRadius: "8px", cursor: "pointer", transition: "transform 0.15s" }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} title="Manage Live TV/Breaking News"><Activity size={18} /></div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {loading ? "-" : stats?.liveStreamConcurrentViewers}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Category distribution */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1rem" }}>Category Views Distribution</h3>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "8px" }} />
                <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ad Performance Stats */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1rem" }}>Ad CTR Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem' }}>Total Impressions:</span>
              <span style={{ fontWeight: 700 }}>{stats?.adPerformance?.impressions?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem' }}>Total Ad Clicks:</span>
              <span style={{ fontWeight: 700 }}>{stats?.adPerformance?.clicks?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(16,185,129,0.05)', borderRadius: '6px', border: '1px solid #10B981' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10B981' }}>Click Through Rate (CTR):</span>
              <span style={{ fontWeight: 800, color: '#10B981' }}>{stats?.adPerformance?.ctr}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Geo Heatmap density listing */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>District Views Heatmap Listing</h3>
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Location Headline</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Coords (Lat, Lon)</th>
                  <th style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>Views</th>
                </tr>
              </thead>
              <tbody>
                {stats?.geoHeatmap?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.75rem 0.5rem" }}>{item.title}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: 'var(--text-secondary)' }}>{item.lat}, {item.lon}</td>
                    <td style={{ padding: "0.75rem 0.5rem", textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>{item.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System & Cache status */}
        <div className="glass-panel" style={{ padding: "1.5rem", border: "1px solid var(--border-color)" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Server size={18} /> System performance & Redis cache
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
              <span>Redis Cache Hit Ratio</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>{stats?.systemPerformance?.redisCacheHitRatio}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
              <span>Redis Memory Allocated</span>
              <span>{stats?.systemPerformance?.redisMemoryUsed}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
              <span>System Exception Logs</span>
              <span style={{ color: stats?.systemPerformance?.exceptionsCount > 0 ? '#EF4444' : '#10B981', fontWeight: 700 }}>
                {stats?.systemPerformance?.exceptionsCount} Alerts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
