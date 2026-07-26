import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import { 
  Images, Plus, Trash2, Edit3, X, ChevronLeft, ChevronRight, Upload, ImageIcon, Sparkles 
} from "lucide-react";
import { getPreviewUrl } from "../../components/common/ImageUploadPreview";

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  borderRadius: "8px",
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  fontSize: "0.85rem",
  boxSizing: "border-box",
  outline: "none"
};

const labelStyle = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
  marginBottom: "0.4rem",
  display: "block"
};

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    imageUrl: "",
    headline: "",
    categoryTag: "Breaking News",
    description: "",
    buttonText: "Read More",
    buttonLink: "",
    displayOrder: 1,
    status: "Active",
    scheduleDate: "",
    expiryDate: ""
  });

  const triggerToast = (text, isError = false) => {
    if (isError) {
      setErrorMsg(text);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setSuccessMsg(text);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hero-slider/getAll?page=0&size=50&sortBy=displayOrder&direction=asc");
      const data = res.data || res;
      setSlides(Array.isArray(data) ? data : (data?.content || []));
    } catch (err) {
      console.error("Failed to fetch slides:", err);
      triggerToast("Failed to load slides from server.", true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Cycle preview carousel
  const nextPreview = () => {
    if (slides.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevPreview = () => {
    if (slides.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Drag and Drop / Select Image handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await api.post("/articles/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data && res.data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
        triggerToast("Image uploaded successfully!");
      } else {
        triggerToast("Failed to parse uploaded image URL.", true);
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || "File upload failed.", true);
    } finally {
      setUploading(false);
    }
  };

  // Form actions
  const openAddModal = () => {
    setFormData({
      id: null,
      imageUrl: "",
      headline: "",
      categoryTag: "Breaking News",
      description: "",
      buttonText: "Read More",
      buttonLink: "",
      displayOrder: slides.length + 1,
      status: "Active",
      scheduleDate: "",
      expiryDate: ""
    });
    setShowModal(true);
  };

  const openEditModal = (slide) => {
    setFormData({
      id: slide.id,
      imageUrl: slide.imageUrl || "",
      headline: slide.headline || "",
      categoryTag: slide.categoryTag || "Breaking News",
      description: slide.description || "",
      buttonText: slide.buttonText || "Read More",
      buttonLink: slide.buttonLink || "",
      displayOrder: slide.displayOrder || 1,
      status: slide.status || "Active",
      scheduleDate: slide.scheduleDate ? slide.scheduleDate.substring(0, 16) : "",
      expiryDate: slide.expiryDate ? slide.expiryDate.substring(0, 16) : ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      await api.delete(`/hero-slider/${id}`);
      triggerToast("Slide deleted successfully.");
      fetchSlides();
      if (currentSlideIndex >= slides.length - 1 && currentSlideIndex > 0) {
        setCurrentSlideIndex((prev) => prev - 1);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to delete slide.", true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.headline) {
      triggerToast("Headline is required.", true);
      return;
    }
    try {
      const payload = {
        ...formData,
        scheduleDate: formData.scheduleDate ? formData.scheduleDate + ":00" : null,
        expiryDate: formData.expiryDate ? formData.expiryDate + ":00" : null
      };
      
      await api.post("/hero-slider/saveUpdate", payload);
      triggerToast(formData.id ? "Slide updated successfully!" : "Slide added successfully!");
      setShowModal(false);
      fetchSlides();
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || "Failed to save slide.", true);
    }
  };

  // Helper colors based on index or category tag
  const getBadgeStyle = (tag) => {
    const text = (tag || "").toLowerCase();
    if (text.includes("breaking") || text.includes("செய்தி")) return { background: "var(--danger)", color: "#FFF" };
    if (text.includes("tech") || text.includes("தொழில்நுட்பம்")) return { background: "var(--success)", color: "#FFF" };
    if (text.includes("sport") || text.includes("விளையாட்டு")) return { background: "var(--warning)", color: "#FFF" };
    return { background: "var(--primary)", color: "#FFF" };
  };

  const activeSlide = slides[currentSlideIndex];

  return (
    <div className="animate-fade-in" style={{ padding: "0 1rem" }}>
      {/* Toast Alert Messages */}
      {successMsg && (
        <div className="glass-panel" style={{
          position: "fixed", top: "20px", right: "20px", background: "rgba(16,185,129,0.9)", color: "white",
          padding: "0.75rem 1.5rem", borderRadius: "8px", zIndex: 1000, fontWeight: 600, boxShadow: "var(--shadow-lg)"
        }}>
          ✅ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="glass-panel" style={{
          position: "fixed", top: "20px", right: "20px", background: "rgba(239,68,68,0.9)", color: "white",
          padding: "0.75rem 1.5rem", borderRadius: "8px", zIndex: 1000, fontWeight: 600, boxShadow: "var(--shadow-lg)"
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem", color: "var(--text-primary)" }}>
            <Images size={26} color="var(--primary)" /> Hero Slider
          </h1>
          <p className="text-secondary" style={{ margin: 0 }}>Manage the homepage hero slider images and content.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} /> Add Slide
        </button>
      </div>

      {/* 1. Slider Preview Carousel Card */}
      <div className="glass-panel card mb-4" style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-color)", background: "var(--bg-surface)", marginBottom: "2rem" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)", fontWeight: 600, color: "var(--text-primary)" }}>
          Slider Preview
        </div>
        <div style={{ position: "relative", minHeight: "350px", maxHeight: "400px", background: "#090d16", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {slides.length > 0 && activeSlide ? (
            <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
              {/* Slide Background Image or Gradient fallback */}
              {activeSlide.imageUrl ? (
                <img 
                  src={getPreviewUrl(activeSlide.imageUrl)} 
                  alt={activeSlide.headline} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%", opacity: 0.85,
                  background: `linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)`
                }} />
              )}
              {/* Content Overlay */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: "2.5rem 3.5rem",
                background: "linear-gradient(to top, rgba(9,13,22,1) 0%, rgba(9,13,22,0.6) 50%, rgba(9,13,22,0) 100%)",
                color: "white", display: "flex", flexDirection: "column", alignItems: "flex-start"
              }}>
                <span className="badge" style={{
                  padding: "0.3rem 0.75rem", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 700, 
                  marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px",
                  ...getBadgeStyle(activeSlide.categoryTag)
                }}>
                  {activeSlide.categoryTag || "News"}
                </span>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "#FFFFFF", lineHeight: 1.2 }}>
                  {activeSlide.headline}
                </h2>
                <p style={{ fontSize: "0.95rem", opacity: 0.85, margin: "0 0 1.25rem 0", maxWidth: "800px", lineHeight: 1.5 }}>
                  {activeSlide.description || "No description provided."}
                </p>
                {activeSlide.buttonLink && (
                  <a 
                    href={activeSlide.buttonLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                    style={{ textDecoration: "none", fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}
                  >
                    {activeSlide.buttonText || "Read More"}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <p style={{ margin: 0, fontSize: "0.95rem" }}>No slides created yet. Click "+ Add Slide" to configure home slider slides.</p>
            </div>
          )}

          {/* Navigation Controls */}
          {slides.length > 1 && (
            <>
              <button onClick={prevPreview} style={{
                position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)", border: "none", color: "white", width: "40px", height: "40px",
                borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s"
              }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                 onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <ChevronLeft size={22} />
              </button>
              <button onClick={nextPreview} style={{
                position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)", border: "none", color: "white", width: "40px", height: "40px",
                borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s"
              }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                 onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <ChevronRight size={22} />
              </button>

              {/* Dots indicator list */}
              <div style={{ position: "absolute", bottom: "1.25rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem", zIndex: 10 }}>
                {slides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    style={{
                      width: "8px", height: "8px", borderRadius: "50%", padding: 0, border: "none",
                      background: currentSlideIndex === idx ? "var(--primary)" : "rgba(255,255,255,0.4)",
                      cursor: "pointer", transition: "all 0.2s",
                      transform: currentSlideIndex === idx ? "scale(1.25)" : "none"
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. All Slides List Table Card */}
      <div className="glass-panel card" style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-color)", background: "var(--bg-surface)" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)", fontWeight: 600, color: "var(--text-primary)" }}>
          All Slides
        </div>
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Loading slider data...</div>
          ) : slides.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No slider slides configured.</div>
          ) : (
            <table className="table" style={{ width: "100%", borderCollapse: "collapse", margin: 0 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(0,0,0,0.05)" }}>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>Preview</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>Headline</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>Button Text</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "center", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>Order</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>Status</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>Schedule</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>Expiry</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "center", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((slide) => (
                  <tr key={slide.id} style={{ borderBottom: "1px solid var(--border-color)", verticalAlign: "middle" }}>
                    {/* Preview Thumbnail */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      {slide.imageUrl ? (
                        <img 
                          src={getPreviewUrl(slide.imageUrl)} 
                          alt="Thumb" 
                          style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "6px" }} 
                        />
                      ) : (
                        <div style={{
                          width: "60px", height: "40px", borderRadius: "6px",
                          background: `linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)`,
                          display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", fontWeight: 700
                        }}>
                          {slide.categoryTag ? slide.categoryTag.substring(0, 2).toUpperCase() : "SL"}
                        </div>
                      )}
                    </td>
                    {/* Headline */}
                    <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {slide.headline}
                    </td>
                    {/* Button Text */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "var(--text-secondary)" }}>
                      {slide.buttonText || "Read More"}
                    </td>
                    {/* Display Order */}
                    <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                      <span className="badge" style={{ background: "var(--primary-glow)", color: "var(--primary)", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: 600 }}>
                        {slide.displayOrder}
                      </span>
                    </td>
                    {/* Status */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem" }}>
                        <span style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          background: slide.status === "Active" ? "#10B981" : slide.status === "Scheduled" ? "#3B82F6" : "#64748B"
                        }} />
                        <span style={{ color: "var(--text-primary)" }}>{slide.status}</span>
                      </span>
                    </td>
                    {/* Dates */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {slide.scheduleDate ? new Date(slide.scheduleDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                    </td>
                    <td style={{ padding: "0.85rem 1.25rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {slide.expiryDate ? new Date(slide.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                    </td>
                    {/* Action buttons */}
                    <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                        <button 
                          onClick={() => openEditModal(slide)} 
                          className="btn btn-secondary" 
                          style={{ padding: "0.35rem", borderRadius: "6px", display: "inline-flex", alignItems: "center" }}
                          title="Edit"
                        >
                          <Edit3 size={14} color="var(--primary)" />
                        </button>
                        <button 
                          onClick={() => handleDelete(slide.id)} 
                          className="btn btn-secondary" 
                          style={{ padding: "0.35rem", borderRadius: "6px", display: "inline-flex", alignItems: "center", border: "1px solid rgba(239,68,68,0.25)" }}
                          title="Delete"
                        >
                          <Trash2 size={14} color="var(--danger)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 3. Add / Edit Slide Modal Dialog */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1050, padding: "1rem"
        }}>
          <div className="modal-content glass-panel" style={{
            width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto",
            background: "var(--bg-surface)", border: "1px solid var(--border-color)",
            borderRadius: "12px", boxShadow: "var(--shadow-lg)"
          }}>
            {/* Modal Header */}
            <div className="modal-header" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)"
            }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                {formData.id ? "Edit Slide" : "Add New Slide"}
              </h2>
              <button onClick={() => setShowModal(false)} className="icon-btn" style={{
                background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "4px"
              }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                {/* 1. Slider Image Upload Box */}
                <div>
                  <label style={labelStyle}>Slider Image <span style={{ color: "#EF4444" }}>*</span></label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "2px dashed var(--border-color)", borderRadius: "10px", padding: "2.5rem 1.5rem",
                      textAlign: "center", cursor: uploading ? "wait" : "pointer", background: "var(--bg-secondary)",
                      transition: "border-color 0.2s, background-color 0.2s", position: "relative",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}
                  >
                    {formData.imageUrl ? (
                      <div style={{ position: "relative", width: "100%", height: "160px", borderRadius: "8px", overflow: "hidden" }}>
                        <img 
                          src={getPreviewUrl(formData.imageUrl)} 
                          alt="Slide preview" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, imageUrl: "" }));
                          }}
                          style={{
                            position: "absolute", top: "8px", right: "8px", background: "rgba(239,68,68,0.9)",
                            color: "white", border: "none", borderRadius: "50%", width: "26px", height: "26px",
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={38} style={{ color: "var(--text-muted)", opacity: 0.7 }} />
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                          {uploading ? "Uploading file..." : "Drop slider image here"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          1920×700px recommended (JPG, WebP)
                        </div>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      style={{ display: "none" }} 
                      disabled={uploading}
                    />
                  </div>
                  {/* Backup URL text field */}
                  <div style={{ marginTop: "0.5rem" }}>
                    <input 
                      type="text" 
                      placeholder="Or paste direct image URL here..." 
                      style={inputStyle}
                      value={formData.imageUrl} 
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. Headline and Order */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 2 }}>
                    <label style={labelStyle}>Headline <span style={{ color: "#EF4444" }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Slide headline" 
                      style={inputStyle} 
                      value={formData.headline}
                      onChange={e => setFormData({ ...formData, headline: e.target.value })}
                      required 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Category Tag</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Breaking News" 
                      style={inputStyle} 
                      value={formData.categoryTag}
                      onChange={e => setFormData({ ...formData, categoryTag: e.target.value })}
                    />
                  </div>
                  <div style={{ width: "90px" }}>
                    <label style={labelStyle}>Order</label>
                    <input 
                      type="number" 
                      min="1" 
                      style={inputStyle} 
                      value={formData.displayOrder}
                      onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                {/* 3. Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea 
                    rows="3" 
                    placeholder="Brief description for the slide..." 
                    style={{ ...inputStyle, resize: "vertical" }}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* 4. Button Text and Button Link */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Button Text</label>
                    <input 
                      type="text" 
                      placeholder="Read More" 
                      style={inputStyle} 
                      value={formData.buttonText}
                      onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={labelStyle}>Button Link</label>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      style={inputStyle} 
                      value={formData.buttonLink}
                      onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                    />
                  </div>
                </div>

                {/* 5. Schedule Date and Expiry Date */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Schedule Date</label>
                    <input 
                      type="datetime-local" 
                      style={inputStyle} 
                      value={formData.scheduleDate}
                      onChange={e => setFormData({ ...formData, scheduleDate: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Expiry Date</label>
                    <input 
                      type="datetime-local" 
                      style={inputStyle} 
                      value={formData.expiryDate}
                      onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* 6. Status Selection */}
                <div>
                  <label style={labelStyle}>Status</label>
                  <select 
                    style={inputStyle}
                    value={formData.status} 
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
