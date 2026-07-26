import React, { useState, useEffect } from "react";
import api from "../../api";
import { Calendar, Plus, ChevronLeft, ChevronRight, User, Clock, FileText, CheckCircle, Trash2 } from "lucide-react";
import DatePickerInput from "../../components/common/DatePickerInput";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const STATUS_CONFIG = {
  idea:       { label: "Idea",       color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  assigned:   { label: "Assigned",   color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  in_progress:{ label: "In Progress",color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  review:     { label: "Review",     color: "#EF4444", bg: "rgba(239,68,68,0.12)"  },
  published:  { label: "Published",  color: "#10B981", bg: "rgba(16,185,129,0.12)" },
};

const CAT_COLORS = { Politics:"#EF4444",Business:"#F59E0B",Sports:"#10B981",Cinema:"#8B5CF6",Technology:"#3B82F6",International:"#06B6D4" };

const inputStyle = {
  width: "100%", padding: "0.75rem 1rem", borderRadius: "8px",
  border: "1px solid var(--border-color)", background: "var(--bg-secondary)",
  color: "var(--text-primary)", fontSize: "0.875rem", boxSizing: "border-box",
};
const labelStyle = { fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem", display: "block" };

const EditorialCalendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [form, setForm] = useState({ title: "", categoryId: "", assignedTo: "", deadline: "", status: "idea", notes: "" });
  const [msg, setMsg] = useState(null);
  const [view, setView] = useState("calendar"); // calendar | list

  const showMsg = (text, isError = false) => { setMsg({ text, isError }); setTimeout(() => setMsg(null), 4000); };

  useEffect(() => {
    Promise.allSettled([
      api.get("/admin/analytics/dashboard"),
      api.get("/categories"),
    ]).then(([usersRes, catRes]) => {
      setCategories(catRes.status === "fulfilled" ? (catRes.value.data || []) : []);
    });
    // Load mock assignments from localStorage for now (backend endpoint to be added)
    const saved = localStorage.getItem("editorialAssignments");
    if (saved) try { setAssignments(JSON.parse(saved)); } catch {}
    setLoading(false);
  }, []);

  const saveAssignments = (updated) => {
    setAssignments(updated);
    localStorage.setItem("editorialAssignments", JSON.stringify(updated));
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };

  const getAssignmentsForDay = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return assignments.filter(a => a.deadline === dateStr);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title || !form.deadline) { showMsg("Title and deadline are required.", true); return; }
    const newItem = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    saveAssignments([...assignments, newItem]);
    showMsg("Assignment created!");
    setForm({ title: "", categoryId: "", assignedTo: "", deadline: "", status: "idea", notes: "" });
    setShowForm(false);
  };

  const updateStatus = (id, status) => {
    saveAssignments(assignments.map(a => a.id === id ? { ...a, status } : a));
    showMsg("Status updated.");
  };

  const deleteAssignment = (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    saveAssignments(assignments.filter(a => a.id !== id));
    showMsg("Deleted.");
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const overdue = assignments.filter(a => a.deadline < today.toISOString().slice(0,10) && a.status !== "published").length;
  const statusCounts = Object.fromEntries(Object.keys(STATUS_CONFIG).map(s => [s, assignments.filter(a => a.status === s).length]));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <Calendar size={26} color="var(--primary)" /> Editorial Calendar
          </h1>
          <p className="text-secondary">Assign stories to reporters with deadlines and track progress.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.25rem", background: "var(--bg-secondary)", borderRadius: "8px", padding: "3px" }}>
            {["calendar","list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "0.35rem 0.75rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem",
                background: view === v ? "var(--primary)" : "transparent", color: view === v ? "#fff" : "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                {v === "calendar" ? <><Calendar size={13} /> Calendar</> : <><FileText size={13} /> List</>}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={16} /> {showForm ? "Cancel" : "New Assignment"}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="glass-panel" style={{ padding: "0.9rem 1rem", borderLeft: `3px solid ${cfg.color}` }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: cfg.color }}>{statusCounts[key] || 0}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{cfg.label}</div>
          </div>
        ))}
      </div>
      {overdue > 0 && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", padding: "0.75rem 1.25rem", borderRadius: "8px", marginBottom: "1.5rem", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle size={16} /> {overdue} overdue assignment{overdue > 1 ? "s" : ""} — check your list view!
        </div>
      )}

      {msg && (
        <div style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem",
          background: msg.isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          color: msg.isError ? "#EF4444" : "#10B981",
          border: `1px solid ${msg.isError ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}` }}>
          {msg.text}
        </div>
      )}

      {/* New Assignment Form */}
      {showForm && (
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "14px", border: "2px solid var(--primary)", marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={18} /> Create Story Assignment</h3>
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Story Title *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="What is this story about?" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">— Select —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Assigned To (email)</label>
                <input style={inputStyle} value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} placeholder="reporter@king24x7.com" />
              </div>
              <div>
                <DatePickerInput
                  label="Deadline *"
                  value={form.deadline}
                  onChange={val => setForm(f => ({ ...f, deadline: val || '' }))}
                  required
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Initial Status</label>
                <select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {Object.entries(STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Notes / Angle</label>
                <input style={inputStyle} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Story angle, sources to contact, key details..." />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Plus size={16} /> Create Assignment
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {view === "calendar" ? (
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <button onClick={prevMonth} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "0.4rem 0.75rem", cursor: "pointer", color: "var(--text-primary)" }}>
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ fontWeight: 700 }}>{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={nextMonth} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "0.4rem 0.75rem", cursor: "pointer", color: "var(--text-primary)" }}>
              <ChevronRight size={18} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "4px" }}>
            {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", padding: "0.35rem" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px" }}>
            {calendarCells.map((day, idx) => {
              const dayAssignments = day ? getAssignmentsForDay(day) : [];
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              return (
                <div key={idx} onClick={() => day && setSelectedDay(selectedDay === day ? null : day)}
                  style={{ minHeight: "80px", borderRadius: "8px", padding: "0.4rem", cursor: day ? "pointer" : "default",
                    background: !day ? "transparent" : isToday ? "var(--primary-glow)" : selectedDay === day ? "var(--bg-secondary)" : "var(--bg-surface)",
                    border: isToday ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                    transition: "all 0.15s" }}>
                  {day && (
                    <>
                      <div style={{ fontWeight: isToday ? 800 : 600, fontSize: "0.85rem", color: isToday ? "var(--primary)" : "var(--text-primary)", marginBottom: "4px" }}>{day}</div>
                      {dayAssignments.slice(0, 3).map(a => (
                        <div key={a.id} style={{ fontSize: "0.65rem", background: STATUS_CONFIG[a.status]?.bg || "var(--bg-secondary)",
                          color: STATUS_CONFIG[a.status]?.color || "var(--text-secondary)", padding: "2px 4px", borderRadius: "3px", marginBottom: "2px",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {a.title}
                        </div>
                      ))}
                      {dayAssignments.length > 3 && <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>+{dayAssignments.length - 3} more</div>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {selectedDay && getAssignmentsForDay(selectedDay).length > 0 && (
            <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
              <h4 style={{ marginBottom: "0.75rem" }}>Assignments on {MONTHS[currentMonth]} {selectedDay}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {getAssignmentsForDay(selectedDay).map(a => (
                  <AssignmentRow key={a.id} assignment={a} onStatusChange={updateStatus} onDelete={deleteAssignment} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {loading ? <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
            : assignments.length === 0 ? <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>No assignments yet. Create one above!</div>
            : assignments.sort((a,b) => a.deadline.localeCompare(b.deadline)).map(a => (
              <AssignmentRow key={a.id} assignment={a} onStatusChange={updateStatus} onDelete={deleteAssignment} showDate />
            ))
          }
        </div>
      )}
    </div>
  );
};

const AssignmentRow = ({ assignment: a, onStatusChange, onDelete, showDate }) => {
  const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.idea;
  const isOverdue = a.deadline < new Date().toISOString().slice(0,10) && a.status !== "published";
  return (
    <div className="glass-panel" style={{ padding: "1rem 1.25rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "1rem",
      borderLeft: `4px solid ${isOverdue ? "#EF4444" : cfg.color}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{a.title}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {a.assignedTo && <span><User size={11} style={{ display: "inline" }} /> {a.assignedTo}</span>}
          {a.deadline && <span style={{ color: isOverdue ? "#EF4444" : "inherit" }}><Clock size={11} style={{ display: "inline" }} /> {a.deadline}{isOverdue ? " (OVERDUE)" : ""}</span>}
          {a.notes && <span>{a.notes}</span>}
        </div>
      </div>
      <select value={a.status} onChange={e => onStatusChange(a.id, e.target.value)}
        style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", border: `1px solid ${cfg.color}`,
          background: cfg.bg, color: cfg.color, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
        {Object.entries(STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
      </select>
      <button onClick={() => onDelete(a.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", padding: "0.3rem 0.5rem", cursor: "pointer", color: "#EF4444", display: "flex", alignItems: "center" }}><Trash2 size={14} /></button>
    </div>
  );
};

export default EditorialCalendar;
