import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Save, AlertCircle, FileImage, Send, MapPin } from "lucide-react";

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  const formRef = useRef(null);

  const [form, setForm] = useState({
    titleTa: "", titleEn: "", contentTa: "", contentEn: "",
    categoryId: "", shortDescTa: "", shortDescEn: "",
    featuredImage: "", status: "draft"
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [active, setActive] = useState(false);

  const showMsg = (text, isError = false) => { setMsg({ text, isError }); setTimeout(() => setMsg(null), 4000); };

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data || []));
    if (isEditing) {
      api.get(`/articles/${id}`).then(r => { setForm(r.data); setActive(true); })
        .catch(() => { showMsg("Failed to load article.", true); setActive(true); });
    } else { setActive(true); }
  }, [id, isEditing]);

  useEffect(() => {
    if (!active) return;
    const initEditor = () => {
      const commonConfig = {
        height: 400,
        menubar: false,
        plugins: ["lists", "link", "image", "media", "table", "code", "wordcount"],
        toolbar: "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image media",
        skin: "oxide",
        content_css: "default",
        content_style: "body { font-family:Inter,sans-serif; font-size:16px; line-height: 1.6; } img { border-radius: 8px; }",
        images_upload_handler: async (blobInfo) => {
          const fd = new FormData();
          fd.append("file", blobInfo.blob(), blobInfo.filename());
          const res = await api.post("/articles/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
          return res.data.url;
        }
      };

      if (window.tinymce) {
        window.tinymce.init({
          ...commonConfig,
          selector: "#j-tinymce-ta",
          setup: ed => ed.on("change keyup blur", () => setForm(f => ({ ...f, contentTa: ed.getContent() }))),
          init_instance_callback: ed => formRef.current.contentTa && ed.setContent(formRef.current.contentTa)
        });
        window.tinymce.init({
          ...commonConfig,
          selector: "#j-tinymce-en",
          setup: ed => ed.on("change keyup blur", () => setForm(f => ({ ...f, contentEn: ed.getContent() }))),
          init_instance_callback: ed => formRef.current.contentEn && ed.setContent(formRef.current.contentEn)
        });
      }
    };
    initEditor();
    return () => { if (window.tinymce) { window.tinymce.remove("#j-tinymce-ta"); window.tinymce.remove("#j-tinymce-en"); } };
  }, [active]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/articles/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm(f => ({ ...f, featuredImage: res.data.url }));
      showMsg("Featured image uploaded!");
    } catch { showMsg("Failed to upload image.", true); }
    setLoading(false);
  };

  const save = async (submitForReview) => {
    let payload = { ...form };
    if (!payload.titleTa) { showMsg("Tamil title is required.", true); return; }
    if (!payload.categoryId) { showMsg("Please select a category.", true); return; }

    if (submitForReview) payload.status = "pending";

    setLoading(true);
    
    if (payload.status === "pending" || payload.status === "published") {
      try {
        let seoUpdates = {};
        if (!payload.metaTitle) seoUpdates.metaTitle = payload.titleEn || payload.titleTa;
        if (!payload.metaDescription && payload.contentTa) {
          const res = await api.post("/articles/ai-assist", { action: "summarize", text: payload.contentTa, context: "ta" });
          if (res.data?.result) seoUpdates.metaDescription = res.data.result;
        }
        payload = { ...payload, ...seoUpdates };
      } catch (e) { console.warn("SEO AI failed", e); }
    }

    try {
      if (isEditing) {
        await api.put("/articles/saveUpdate", { ...payload, id: parseInt(id) });
        showMsg("Draft updated successfully!");
      } else {
        await api.post("/articles/saveUpdate", payload);
        showMsg("Draft created successfully!");
      }
      setTimeout(() => navigate("/journalist/posts"), 1500);
    } catch (err) { showMsg(err.response?.data?.message || "Failed to save.", true); }
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-surface)", color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box" };
  const labelStyle = { fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem", display: "block" };

  return (
    <div className="animate-fade-in" style={{ padding: "1.5rem 0", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>{isEditing ? "Edit Story" : "Write Story"}</h1>
          <p className="text-secondary">Save as draft or submit to editors for review.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => save(false)} disabled={loading} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Save size={16} /> Save Draft</button>
          <button onClick={() => save(true)} disabled={loading} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Send size={16} /> Submit for Review</button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: "1rem", marginBottom: "1.5rem", borderRadius: "8px", background: msg.isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", color: msg.isError ? "#EF4444" : "#10B981", border: `1px solid ${msg.isError ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`, display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
          <AlertCircle size={18} /> {msg.text}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={labelStyle}>Tamil Headline *</label><input style={inputStyle} value={form.titleTa} onChange={e => setForm(f => ({ ...f, titleTa: e.target.value }))} /></div>
            <div><label style={labelStyle}>English Headline</label><input style={inputStyle} value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} /></div>
          </div>
          <div><label style={labelStyle}>Category *</label>
            <select style={inputStyle} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
              <option value="">— Select Category —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nameTa} ({c.name})</option>)}
            </select>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <label style={{ ...labelStyle, marginBottom: "1rem" }}>Tamil Content</label>
          <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden" }}><textarea id="j-tinymce-ta"></textarea></div>
        </div>
        
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <label style={{ ...labelStyle, marginBottom: "1rem" }}>English Content (Optional)</label>
          <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden" }}><textarea id="j-tinymce-en"></textarea></div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <label style={labelStyle}>Featured Image</label>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            {form.featuredImage ? (
              <div style={{ position: "relative", width: "120px", height: "80px", borderRadius: "8px", overflow: "hidden" }}>
                <img src={form.featuredImage} alt="Featured" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => setForm(f => ({ ...f, featuredImage: "" }))} style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.7)", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>?</button>
              </div>
            ) : (
              <div style={{ width: "120px", height: "80px", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px dashed var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><FileImage size={24} /></div>
            )}
            <div style={{ flex: 1 }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} id="f-upload" />
              <label htmlFor="f-upload" className="btn btn-secondary" style={{ display: "inline-flex", cursor: "pointer", alignItems: "center", gap: "0.5rem" }}>Upload Image File</label>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Or paste URL below:</div>
              <input style={{ ...inputStyle, marginTop: "0.5rem" }} value={form.featuredImage} onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostEditor;
