import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * DatePickerInput — reusable date input with:
 *  - Typed dd/mm/yyyy input
 *  - Calendar popup (no external library)
 *  - Two-way sync: type a year → calendar jumps to that year immediately
 *  - Inline validation (rejects 31/02/2026 etc.)
 *
 * Props:
 *   value        — ISO date string "YYYY-MM-DD" or "" (controlled)
 *   onChange     — (isoString) => void
 *   label        — string (optional)
 *   required     — bool
 *   placeholder  — string
 *   min          — ISO "YYYY-MM-DD" (optional, blocks past dates if set)
 *   id           — string (optional, for label htmlFor)
 */

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// Validate a date object is real (rejects 31 Feb etc.)
const isValidDate = (y, m, d) => {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === Number(y) &&
    date.getMonth() === m - 1 &&
    date.getDate() === Number(d)
  );
};

// Parse "dd/mm/yyyy" → {d, m, y} or null
const parseDisplay = (str) => {
  const parts = (str || '').split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  return { d, m, y };
};

// Convert ISO "YYYY-MM-DD" → display "dd/mm/yyyy"
const isoToDisplay = (iso) => {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return '';
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// Convert display "dd/mm/yyyy" → ISO "YYYY-MM-DD" or null
const displayToIso = (display) => {
  const parsed = parseDisplay(display);
  if (!parsed) return null;
  const { d, m, y } = parsed;
  if (!isValidDate(y, m, d)) return null;
  return `${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
};

const DatePickerInput = ({
  value = '',
  onChange,
  label,
  required = false,
  placeholder = 'dd/mm/yyyy',
  min,
  id,
}) => {
  const [displayVal, setDisplayVal] = useState(isoToDisplay(value));
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [viewYear, setViewYear] = useState(() => {
    const y = value ? Number(value.split('-')[0]) : new Date().getFullYear();
    return isNaN(y) ? new Date().getFullYear() : y;
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const m = value ? Number(value.split('-')[1]) - 1 : new Date().getMonth();
    return isNaN(m) ? new Date().getMonth() : m;
  });
  const containerRef = useRef(null);

  // Sync displayVal when value prop changes externally
  useEffect(() => {
    const newDisplay = isoToDisplay(value);
    setDisplayVal(newDisplay);
    if (value) {
      const parts = value.split('-');
      const y = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      if (!isNaN(y)) setViewYear(y);
      if (!isNaN(m)) setViewMonth(m);
    }
  }, [value]);

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleTyped = (e) => {
    let raw = e.target.value;

    // Auto-insert slashes while typing
    // Strip non-digits and slashes first
    let digits = raw.replace(/[^\d]/g, '');
    let formatted = '';
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }

    setDisplayVal(formatted);
    setError('');

    // Try to sync calendar view as user types year portion
    if (formatted.length >= 7) {
      const yearStr = formatted.slice(6);
      const yearNum = Number(yearStr);
      if (yearStr.length === 4 && !isNaN(yearNum) && yearNum >= 1900 && yearNum <= 2100) {
        setViewYear(yearNum);
        const monthStr = formatted.slice(3, 5);
        const monthNum = Number(monthStr) - 1;
        if (!isNaN(monthNum) && monthNum >= 0 && monthNum <= 11) {
          setViewMonth(monthNum);
        }
      }
    }

    // On complete date, validate and emit
    if (formatted.length === 10) {
      const parsed = parseDisplay(formatted);
      if (!parsed || !isValidDate(parsed.y, parsed.m, parsed.d)) {
        setError('Invalid date. Please check day, month, and year.');
        onChange && onChange('');
      } else {
        const iso = displayToIso(formatted);
        if (min && iso < min) {
          setError(`Date must be on or after ${isoToDisplay(min)}.`);
          onChange && onChange('');
        } else {
          setError('');
          onChange && onChange(iso);
        }
      }
    } else if (formatted.length === 0) {
      onChange && onChange('');
    }
  };

  const selectDay = useCallback((day) => {
    const m = viewMonth + 1;
    if (!isValidDate(viewYear, m, day)) return;
    const iso = `${viewYear}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    if (min && iso < min) {
      setError(`Date must be on or after ${isoToDisplay(min)}.`);
      return;
    }
    setDisplayVal(`${String(day).padStart(2,'0')}/${String(m).padStart(2,'0')}/${viewYear}`);
    setError('');
    onChange && onChange(iso);
    setOpen(false);
  }, [viewYear, viewMonth, min, onChange]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar cells
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const calCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) calCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calCells.push(i);
  while (calCells.length % 7 !== 0) calCells.push(null);

  // Determine selected day in the current view
  const selectedIso = displayToIso(displayVal);
  const selectedParts = selectedIso ? selectedIso.split('-') : null;
  const selectedInView = selectedParts &&
    Number(selectedParts[0]) === viewYear &&
    Number(selectedParts[1]) - 1 === viewMonth
    ? Number(selectedParts[2]) : null;

  const today = new Date();
  const todayInView = today.getFullYear() === viewYear && today.getMonth() === viewMonth
    ? today.getDate() : null;

  const inputId = id || `datepicker-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}
        >
          {label}{required && <span style={{ color: '#EF4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={inputId}
          type="text"
          value={displayVal}
          onChange={handleTyped}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '0.75rem 2.75rem 0.75rem 1rem',
            borderRadius: '8px',
            border: `1px solid ${error ? '#EF4444' : 'var(--border-color)'}`,
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
        />
        {/* Calendar icon button */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            position: 'absolute',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Open calendar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
      </div>

      {error && (
        <div style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Calendar Popup */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          zIndex: 9999,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          padding: '1rem',
          minWidth: '280px',
          userSelect: 'none',
        }}>
          {/* Month/Year Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={prevMonth}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={viewMonth}
                onChange={e => setViewMonth(Number(e.target.value))}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 6px', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <input
                type="number"
                value={viewYear}
                onChange={e => {
                  const y = Number(e.target.value);
                  if (!isNaN(y) && y >= 1900 && y <= 2100) setViewYear(y);
                }}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 6px', color: 'var(--text-primary)', fontSize: '0.85rem', width: '70px', textAlign: 'center' }}
              />
            </div>
            <button
              type="button"
              onClick={nextMonth}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
            {DAYS_SHORT.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '4px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {calCells.map((day, idx) => {
              const isSelected = day && day === selectedInView;
              const isToday = day && day === todayInView;
              const isPast = min && day && `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` < min;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => day && !isPast && selectDay(day)}
                  disabled={!day || isPast}
                  style={{
                    height: '32px',
                    borderRadius: '6px',
                    border: isToday && !isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    color: !day ? 'transparent' : isSelected ? '#fff' : isPast ? 'var(--text-muted)' : isToday ? 'var(--primary)' : 'var(--text-primary)',
                    cursor: !day || isPast ? 'default' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isSelected || isToday ? 700 : 400,
                    transition: 'all 0.1s',
                    opacity: !day ? 0 : isPast ? 0.4 : 1,
                  }}
                  onMouseEnter={e => {
                    if (day && !isSelected && !isPast) {
                      e.target.style.background = 'var(--bg-secondary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (day && !isSelected) {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  {day || ''}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                selectDay(now.getDate());
              }}
              style={{
                background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px',
                padding: '4px 12px', cursor: 'pointer', color: 'var(--primary)',
                fontSize: '0.8rem', fontWeight: 600,
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerInput;
