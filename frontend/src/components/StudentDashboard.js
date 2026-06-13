import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #F8FAFC; color: #0F172A; -webkit-font-smoothing: antialiased; }
  .shell { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar { width: 248px; flex-shrink: 0; background: #0F172A; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; padding: 0 0 24px; }
  .sb-brand { padding: 28px 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .sb-pill { display: inline-block; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.1em; background: #6366F1; color: #fff; padding: 3px 8px; border-radius: 4px; margin-bottom: 10px; }
  .sb-title { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.35; }
  .sb-sub { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 3px; font-family: 'DM Mono', monospace; }
  .sb-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }
  .sb-section-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; color: rgba(255,255,255,0.28); text-transform: uppercase; padding: 10px 8px 5px; }
  .nav-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border-radius: 7px; font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.5); background: transparent; border: none; cursor: pointer; text-align: left; transition: background 0.15s, color 0.15s; font-family: 'Inter', sans-serif; }
  .nav-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
  .nav-btn.active { background: rgba(99,102,241,0.18); color: #A5B4FC; }
  .nav-btn .icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }
  .nav-badge { margin-left: auto; font-size: 10px; font-weight: 600; background: #6366F1; color: #fff; padding: 2px 7px; border-radius: 10px; font-family: 'DM Mono', monospace; }
  .nav-count { margin-left: auto; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.35); font-family: 'DM Mono', monospace; }
  .sb-footer { padding: 16px 20px 0; border-top: 1px solid rgba(255,255,255,0.07); }
  .sb-user { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: #6366F1; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .sb-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .sb-user-role { font-size: 11px; color: rgba(255,255,255,0.38); font-family: 'DM Mono', monospace; }

  /* Main */
  .main { flex: 1; padding: 36px 40px; overflow-y: auto; min-width: 0; background: #F8FAFC; }
  .topbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
  .topbar-title { font-size: 22px; font-weight: 700; color: #0F172A; }
  .topbar-sub { font-size: 13.5px; color: #64748B; margin-top: 4px; }
  .placement-chip { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; font-size: 12.5px; font-weight: 500; color: #334155; white-space: nowrap; flex-shrink: 0; }
  .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .dot.green  { background: #059669; }
  .dot.orange { background: #D97706; }

  /* Stat cards */
  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 10px 10px 0 0; }
  .stat-card.c-indigo::before { background: #6366F1; }
  .stat-card.c-purple::before { background: #7C3AED; }
  .stat-card.c-green::before  { background: #059669; }
  .stat-card.c-amber::before  { background: #D97706; }
  .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #64748B; margin-bottom: 10px; }
  .stat-value { font-size: 34px; font-weight: 700; font-family: 'DM Mono', monospace; line-height: 1; }
  .stat-value.indigo { color: #6366F1; }
  .stat-value.purple { color: #7C3AED; }
  .stat-value.green  { color: #059669; }
  .stat-value.amber  { color: #D97706; }
  .stat-meta { font-size: 12px; color: #64748B; margin-top: 6px; }
  .prog-bg { height: 5px; border-radius: 3px; background: #E2E8F0; margin-top: 10px; overflow: hidden; }
  .prog-fill { height: 100%; border-radius: 3px; background: #6366F1; transition: width 0.6s ease; }

  /* Panel */
  .panel { background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 26px; }
  .panel + .panel { margin-top: 24px; }
  .panel-title { font-size: 14px; font-weight: 700; color: #0F172A; }
  .panel-sub   { font-size: 12.5px; color: #64748B; margin-top: 3px; margin-bottom: 20px; }

  /* Placement card */
  .p-header { display: flex; align-items: center; gap: 16px; padding: 18px 20px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 20px; }
  .p-org-icon { width: 52px; height: 52px; border-radius: 10px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
  .p-org-name { font-size: 16px; font-weight: 700; color: #0F172A; }
  .p-org-sub  { font-size: 13px; color: #64748B; margin-top: 2px; }
  .p-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
  .p-field { padding: 14px 18px; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; }
  .p-field:nth-child(3n) { border-right: none; }
  .p-field:nth-last-child(-n+3) { border-bottom: none; }
  .p-field-label { font-size: 10px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: #94A3B8; margin-bottom: 5px; }
  .p-field-value { font-size: 13.5px; font-weight: 600; color: #0F172A; word-break: break-word; }
  .p-field-value.empty { color: #CBD5E1; font-weight: 400; font-style: italic; }
  .p-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 12px 18px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 20px; }
  .p-footer-item { font-size: 12.5px; color: #64748B; }
  .p-footer-item b { color: #0F172A; }
  .p-score-badge { display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 8px; background: #EEF2FF; border: 1px solid #C7D2FE; }
  .p-score-label { font-size: 11px; font-weight: 600; color: #6366F1; text-transform: uppercase; letter-spacing: 0.05em; }
  .p-score-val   { font-size: 18px; font-weight: 700; color: #4338CA; font-family: 'DM Mono', monospace; }
  .p-grade-badge { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; font-family: 'DM Mono', monospace; }
  .grade-A { background: #ECFDF5; color: #059669; }
  .grade-B { background: #EEF2FF; color: #6366F1; }
  .grade-C { background: #FFFBEB; color: #D97706; }
  .grade-F { background: #FEF2F2; color: #DC2626; }
  .p-description { padding: 14px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 13.5px; color: #334155; line-height: 1.65; }
  .p-section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #6366F1; margin-bottom: 12px; margin-top: 20px; }

  /* Status badges */
  .sbadge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; font-family: 'DM Mono', monospace; white-space: nowrap; }
  .sbadge.active   { background: #ECFDF5; color: #059669; border: 1px solid #6EE7B7; }
  .sbadge.inactive { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }

  /* No placement */
  .no-placement { display: flex; align-items: flex-start; gap: 16px; padding: 22px; background: #FFFBEB; border: 1px dashed #FDE68A; border-radius: 8px; }
  .no-placement-icon { font-size: 30px; flex-shrink: 0; }
  .no-placement h4 { font-size: 14px; font-weight: 600; color: #92400E; margin-bottom: 4px; }
  .no-placement p  { font-size: 13px; color: #B45309; line-height: 1.5; }

  /* Overview placement strip */
  .ov-placement { background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px 22px; margin-bottom: 24px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .ov-placement-icon { width: 44px; height: 44px; border-radius: 8px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .ov-placement-info { flex: 1; min-width: 0; }
  .ov-placement-name { font-size: 14px; font-weight: 700; color: #0F172A; }
  .ov-placement-meta { font-size: 12.5px; color: #64748B; margin-top: 2px; }
  .ov-placement-fields { display: flex; gap: 24px; flex-wrap: wrap; }
  .ov-field { }
  .ov-field-label { font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #94A3B8; margin-bottom: 3px; }
  .ov-field-value { font-size: 13px; font-weight: 600; color: #0F172A; }

  /* Form */
  .form-row { display: flex; gap: 14px; }
  .form-row .fg { flex: 1; }
  .fg { margin-bottom: 18px; }
  .flabel { display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 6px; letter-spacing: 0.02em; }
  .flabel .req { color: #DC2626; margin-left: 2px; }
  .finput, .ftextarea { width: 100%; padding: 9px 12px; border: 1px solid #E2E8F0; border-radius: 7px; font-size: 13.5px; font-family: 'Inter', sans-serif; color: #0F172A; background: #F8FAFC; transition: border 0.15s, box-shadow 0.15s; outline: none; }
  .finput:focus, .ftextarea:focus { border-color: #6366F1; box-shadow: 0 0 0 3px #EEF2FF; background: #fff; }
  .finput::placeholder, .ftextarea::placeholder { color: #94A3B8; }
  .ftextarea { resize: vertical; }
  .finput.narrow { max-width: 130px; }
  .char-count { font-size: 11px; color: #94A3B8; text-align: right; margin-top: 4px; }

  /* Buttons */
  .btn-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 22px; }
  .btn { padding: 9px 20px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'Inter', sans-serif; transition: background 0.15s, transform 0.1s; display: flex; align-items: center; gap: 6px; }
  .btn:active { transform: scale(0.98); }
  .btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .btn-ghost   { background: #F1F5F9; color: #334155; border: 1px solid #E2E8F0; }
  .btn-ghost:hover:not(:disabled) { background: #E2E8F0; }
  .btn-primary { background: #6366F1; color: #fff; }
  .btn-primary:hover:not(:disabled) { background: #4338CA; }

  /* Alert */
  .alert { display: flex; align-items: flex-start; gap: 9px; padding: 11px 14px; border-radius: 7px; font-size: 13px; font-weight: 500; margin-bottom: 18px; }
  .alert.success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
  .alert.error   { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
  .alert-icon { font-size: 14px; flex-shrink: 0; }

  /* Workflow */
  .workflow-guide { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; align-items: center; }
  .wf-step  { padding: 5px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }
  .wf-arrow { font-size: 12px; color: #94A3B8; }
  .s-draft     { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }
  .s-submitted { background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; }
  .s-reviewed  { background: #F5F3FF; color: #7C3AED; border: 1px solid #DDD6FE; }
  .s-approved  { background: #ECFDF5; color: #059669; border: 1px solid #6EE7B7; }

  /* Log list */
  .log-list { display: flex; flex-direction: column; gap: 10px; }
  .log-item { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border-radius: 8px; border: 1px solid #E2E8F0; background: #F8FAFC; transition: border-color 0.15s; }
  .log-item:hover { border-color: #C7D2FE; }
  .log-week { width: 40px; height: 40px; border-radius: 8px; background: #EEF2FF; color: #6366F1; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 11.5px; font-weight: 600; flex-shrink: 0; line-height: 1.2; text-align: center; }
  .log-info { flex: 1; min-width: 0; }
  .log-title { font-size: 13px; font-weight: 600; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .log-date  { font-size: 11.5px; color: #64748B; margin-top: 2px; }
  .status-pill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; font-family: 'DM Mono', monospace; text-transform: capitalize; }

  /* Misc */
  .divider { border: none; border-top: 1px solid #E2E8F0; margin: 22px 0; }
  .section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #6366F1; margin-bottom: 14px; }
  .empty { text-align: center; padding: 48px 20px; color: #94A3B8; }
  .empty-icon { font-size: 36px; margin-bottom: 12px; }
  .empty h4 { font-size: 14px; font-weight: 600; color: #64748B; margin-bottom: 6px; }
  .empty p  { font-size: 13px; line-height: 1.6; }
  .cta-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; padding: 8px 18px; background: #6366F1; color: #fff; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
  .info-banner { display: flex; gap: 12px; align-items: center; background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; color: #3730A3; }
  .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 16px; color: #64748B; font-size: 14px; }
  .spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid #E2E8F0; border-top-color: #6366F1; animation: spin 0.75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .mobile-tabs { display: none; background: #0F172A; padding: 8px; gap: 4px; overflow-x: auto; position: sticky; top: 0; z-index: 100; }
  .m-tab { background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 8px 12px; font-size: 12.5px; font-weight: 500; white-space: nowrap; border-radius: 5px; cursor: pointer; font-family: 'Inter', sans-serif; }
  .m-tab.active { background: rgba(255,255,255,0.1); color: #fff; }
  @media (max-width: 1100px) {
    .mobile-tabs { display: flex; }
    .main { padding: 24px 20px; }
    .sidebar { display: none; }
    .p-grid { grid-template-columns: repeat(2, 1fr); }
    .p-field:nth-child(3n) { border-right: 1px solid #E2E8F0; }
    .p-field:nth-child(2n) { border-right: none; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const API = 'http://127.0.0.1:8000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('access');
  if (!token) return { 'Content-Type': 'application/json' };
  const clean = token.replace(/['"]/g, '').trim();
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clean}` };
};

const initials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'ST';

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const val = (v) => v || null; // returns null if empty so we can show "Not provided"

const NAV = [
  { id: 'overview',   icon: '🏠', label: 'Overview' },
  { id: 'placement',  icon: '🏢', label: 'My Placement' },
  { id: 'logbook',    icon: '✏️',  label: 'Weekly Logbook', badge: 'NEW' },
  { id: 'history',    icon: '📋', label: 'Log History' },
];

const EMPTY_FORM = { weekNumber: '', weekStartDate: '', weekEndDate: '', activities: '', challenges: '' };

// ─── Grade badge ─────────────────────────────────────────────────────────────
function GradeBadge({ grade }) {
  if (!grade) return null;
  return <span className={`p-grade-badge grade-${grade}`}>{grade}</span>;
}

// ─── Placement field row helper ───────────────────────────────────────────────
function PField({ label, value }) {
  return (
    <div className="p-field">
      <div className="p-field-label">{label}</div>
      <div className={`p-field-value${!value ? ' empty' : ''}`}>{value || 'Not provided'}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const [tab,        setTab]        = useState('overview');
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert,      setAlert]      = useState({ type: '', text: '' });
  const [form,       setForm]       = useState(EMPTY_FORM);

  const [dash, setDash] = useState({
    studentName: 'Student', studentId: '',
    placement: null,   // InternshipPlacement object or null
    metrics:   { totalWeeksSubmitted: 0, pendingWeeks: 0, approvedWeeks: 0, totalWeeks: 12 },
    weeklyPerformance: [],
    recentLogs: []
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('access');
    if (!token) { window.location.href = '/login'; return; }

    (async () => {
      try {
        const stored = localStorage.getItem('user');
        const user   = stored ? JSON.parse(stored) : null;

        const [mRes, lRes, pRes] = await Promise.all([
          fetch(`${API}/dashboard-stats/`,                              { headers: authHeaders() }),
          fetch(`${API}/weekly-logs/?ordering=-week_number&limit=20`,   { headers: authHeaders() }),
          fetch(`${API}/placements/my/`,                                { headers: authHeaders() }),
        ]);

        if ([mRes.status, lRes.status].some(s => s === 401 || s === 403)) {
          localStorage.clear(); window.location.href = '/login'; return;
        }

        const mData = mRes.ok ? await mRes.json() : null;
        const lData = lRes.ok ? await lRes.json() : null;
        // pRes may 404 if student has no placement yet — that's fine
        const pData = pRes.ok ? await pRes.json() : null;

        setDash(prev => ({
          ...prev,
          studentName:       user?.name || user?.username || mData?.student_name || 'Student',
          studentId:         user?.student_number || mData?.student_number || '',
          // Prefer the dedicated placement endpoint; fall back to dashboard-stats
          placement:         pData ?? mData?.placement ?? null,
          metrics:           mData?.metrics           ?? prev.metrics,
          weeklyPerformance: mData?.weekly_performance ?? [],
          recentLogs:        lData?.results ?? lData   ?? [],
        }));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const flash = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: '', text: '' }), 6000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ── Submit log ─────────────────────────────────────────────────────────────
  const submitLog = async (targetStatus) => {
    const { weekNumber, weekStartDate, weekEndDate, activities, challenges } = form;
    if (!weekNumber)                    { flash('error', 'Please enter the week number.'); return; }
    if (!weekStartDate || !weekEndDate) { flash('error', 'Please select both start and end dates.'); return; }
    if (new Date(weekEndDate) < new Date(weekStartDate)) { flash('error', 'End date cannot be before start date.'); return; }
    if (!activities.trim())             { flash('error', 'Tasks & Activities field is required.'); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/weekly-logs/`, {
        method:  'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          week_number:     parseInt(weekNumber, 10),
          week_start_date: weekStartDate,
          week_end_date:   weekEndDate,
          activities:      activities.trim(),
          challenges:      challenges.trim(),
          status:          targetStatus,   // already lowercase: 'draft' | 'submitted'
        }),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear(); window.location.href = '/login'; return;
      }

      if (res.ok) {
        const newLog = await res.json();
        flash('success',
          targetStatus === 'draft'
            ? `Week ${weekNumber} saved as Draft. You can edit it before submitting.`
            : `Week ${weekNumber} submitted! Your supervisor will review it shortly.`
        );
        setDash(prev => ({
          ...prev,
          metrics: targetStatus === 'submitted' ? {
            ...prev.metrics,
            totalWeeksSubmitted: prev.metrics.totalWeeksSubmitted + 1,
            pendingWeeks:        prev.metrics.pendingWeeks + 1,
          } : prev.metrics,
          recentLogs: [newLog, ...prev.recentLogs],
        }));
        setForm(EMPTY_FORM);
        setTimeout(() => setTab('history'), 1200);
      } else {
        const err = await res.json().catch(() => ({}));
        flash('error',
          err?.detail ||
          err?.non_field_errors?.[0] ||
          Object.entries(err).map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`).join(' | ') ||
          'Submission failed — check your inputs.'
        );
      }
    } catch {
      flash('error', 'Cannot establish connection to server. Verify backend is accessible.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const total     = dash.metrics.totalWeeks || 12;
  const submitted = dash.metrics.totalWeeksSubmitted;
  const pct       = Math.round((submitted / total) * 100);
  const p         = dash.placement;   // InternshipPlacement fields (see models.py)
  const avgScore  = dash.weeklyPerformance.length
    ? Math.round(dash.weeklyPerformance.reduce((s, w) => s + (w.score || 0), 0) / dash.weeklyPerformance.length)
    : null;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="loading"><div className="spinner" /><p>Syncing dashboard files…</p></div>
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="shell">

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-pill">ILES · PORTAL</div>
          <div className="sb-title">Internship Logging<br />&amp; Evaluation System</div>
          <div className="sb-sub">Academic Dashboard</div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section-label">Navigation</div>
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn${tab === n.id ? ' active' : ''}`} onClick={() => setTab(n.id)}>
              <span className="icon">{n.icon}</span>
              {n.label}
              {n.badge && <span className="nav-badge">{n.badge}</span>}
              {n.id === 'history' && dash.recentLogs.length > 0 &&
                <span className="nav-count">{dash.recentLogs.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sb-footer">
          <div className="sb-user">
            <div className="avatar">{initials(dash.studentName)}</div>
            <div>
              <div className="sb-user-name">{dash.studentName}</div>
              <div className="sb-user-role">
                {dash.studentId ? `No: ${dash.studentId}` : 'Student Intern'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══════════════════════════════════════════════════════════════ */}
      <main className="main">

        {/* Mobile tab bar */}
        <div className="mobile-tabs">
          {NAV.map(n => (
            <button key={n.id} className={`m-tab${tab === n.id ? ' active' : ''}`} onClick={() => setTab(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>

        {/* Top bar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">
              {tab === 'overview'  && `Welcome back, ${dash.studentName.split(' ')[0]} 👋`}
              {tab === 'placement' && 'My Internship Placement 🏢'}
              {tab === 'logbook'   && 'Weekly Logbook ✏️'}
              {tab === 'history'   && 'Log History 📋'}
            </div>
            <div className="topbar-sub">
              {tab === 'overview'  && "Here's a summary of your internship progress."}
              {tab === 'placement' && 'Your official workplace assignment details.'}
              {tab === 'logbook'   && 'Fill in and submit your weekly work log below.'}
              {tab === 'history'   && 'All your submitted weekly logs and their review status.'}
            </div>
          </div>
          {/* Placement chip in topbar */}
          <div className="placement-chip">
            <div className={`dot ${p?.is_active ? 'green' : 'orange'}`} />
            <strong>{p?.organization_name || 'No placement yet'}</strong>
            <span style={{ color: '#94A3B8' }}>·</span>
            <span>{p?.is_active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {/* ══ OVERVIEW ════════════════════════════════════════════════════════ */}
        {tab === 'overview' && (<>

          {/* Stat cards */}
          <div className="stats-row">
            <div className="stat-card c-indigo">
              <div className="stat-label">Weeks Submitted</div>
              <div className="stat-value indigo">{submitted}</div>
              <div className="stat-meta">of {total} total weeks</div>
              <div className="prog-bg"><div className="prog-fill" style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="stat-card c-purple">
              <div className="stat-label">Awaiting Review</div>
              <div className="stat-value purple">{dash.metrics.pendingWeeks}</div>
              <div className="stat-meta">pending supervisor</div>
            </div>
            <div className="stat-card c-green">
              <div className="stat-label">Approved</div>
              <div className="stat-value green">{dash.metrics.approvedWeeks}</div>
              <div className="stat-meta">weeks confirmed</div>
            </div>
            <div className="stat-card c-amber">
              <div className="stat-label">Avg. Score</div>
              <div className="stat-value amber">{avgScore !== null ? `${avgScore}%` : '—'}</div>
              <div className="stat-meta">{avgScore !== null ? 'across reviewed weeks' : 'no scores yet'}</div>
            </div>
          </div>

          {/* ── Placement summary strip ── */}
          {p ? (
            <div className="ov-placement">
              <div className="ov-placement-icon">🏢</div>
              <div className="ov-placement-info">
                <div className="ov-placement-name">{p.organization_name}</div>
                <div className="ov-placement-meta">
                  {p.position} &nbsp;·&nbsp; {p.location}
                  &nbsp;·&nbsp; {fmtDate(p.start_date)} – {fmtDate(p.end_date)}
                </div>
              </div>
              <div className="ov-placement-fields">
                <div className="ov-field">
                  <div className="ov-field-label">Workplace Supervisor</div>
                  <div className="ov-field-value">{p.workplace_supervisor_name || '—'}</div>
                </div>
                <div className="ov-field">
                  <div className="ov-field-label">Duration</div>
                  <div className="ov-field-value">{p.duration || '—'}</div>
                </div>
                {p.final_grade && (
                  <div className="ov-field">
                    <div className="ov-field-label">Grade</div>
                    <div className="ov-field-value">
                      <GradeBadge grade={p.final_grade} />
                    </div>
                  </div>
                )}
              </div>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 12px', flexShrink: 0 }}
                onClick={() => setTab('placement')}>
                Full details →
              </button>
            </div>
          ) : (
            <div className="no-placement" style={{ marginBottom: 24 }}>
              <div className="no-placement-icon">🏢</div>
              <div>
                <h4>No placement assigned yet</h4>
                <p>Your internship placement will appear here once the administrator assigns you to an organisation. Contact your internship coordinator if this is unexpected.</p>
              </div>
            </div>
          )}

          {/* Reminder banner */}
          {submitted < total && (
            <div className="info-banner">
              <span>💡</span>
              <div>
                <b>Don't forget your weekly log.</b> {total - submitted} week{total - submitted !== 1 ? 's' : ''} remaining.{' '}
                <span onClick={() => setTab('logbook')} style={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>
                  Submit now →
                </span>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="panel">
            <div className="panel-title">Evaluation Score Trend</div>
            <div className="panel-sub">Weekly performance from supervisor and academic reviews (0–100%)</div>
            <div style={{ height: 260 }}>
              {dash.weeklyPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dash.weeklyPerformance}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0,100]} tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                      formatter={v => [`${v}%`, 'Score']} />
                    <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2.5}
                      fill="url(#sg)" dot={{ r: 4, fill: '#6366F1', strokeWidth: 0 }} name="Score" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty">
                  <div className="empty-icon">📈</div>
                  <h4>No scores yet</h4>
                  <p>Scores appear here once your supervisor reviews and grades your submitted logs.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent logs */}
          {dash.recentLogs.length > 0 && (
            <div className="panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div className="panel-title">Recent Logs</div>
                  <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>
                    Your last {Math.min(dash.recentLogs.length, 4)} entries
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}
                  onClick={() => setTab('history')}>View all →</button>
              </div>
              <div className="log-list">
                {dash.recentLogs.slice(0, 4).map((log, i) => (
                  <div className="log-item" key={log.id ?? i}>
                    <div className="log-week">W<br />{log.week_number ?? i + 1}</div>
                    <div className="log-info">
                      <div className="log-title">{log.activities?.slice(0, 72)}{log.activities?.length > 72 ? '…' : ''}</div>
                      <div className="log-date">{fmtDate(log.week_start_date)}</div>
                    </div>
                    <span className={`status-pill s-${log.status?.toLowerCase()}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>)}

        {/* ══ PLACEMENT TAB ════════════════════════════════════════════════════ */}
        {tab === 'placement' && (
          <div className="panel">
            <div className="panel-title">Internship Placement Details</div>
            <div className="panel-sub">
              Your official workplace assignment as recorded by the Internship Administrator
            </div>

            {p ? (<>

              {/* Organisation header */}
              <div className="p-header">
                <div className="p-org-icon">🏢</div>
                <div style={{ flex: 1 }}>
                  <div className="p-org-name">{p.organization_name}</div>
                  <div className="p-org-sub">{p.position} &nbsp;·&nbsp; {p.location}</div>
                </div>
                <span className={`sbadge ${p.is_active ? 'active' : 'inactive'}`}>
                  {p.is_active ? '● Active' : '○ Inactive'}
                </span>
              </div>

              {/* ── Section 1: Organisation ── */}
              <div className="section-label">Organisation Details</div>
              <div className="p-grid">
                <PField label="Organisation Name"    value={val(p.organization_name)} />
                <PField label="Registration Number"  value={val(p.registration_number)} />
                <PField label="Position / Role"      value={val(p.position)} />
                <PField label="Location"             value={val(p.location)} />
                <PField label="Course"               value={val(p.course)} />
                <PField label="Duration"             value={val(p.duration)} />
                <PField label="Stipend"              value={val(p.stipend)} />
                <PField label="Start Date"           value={fmtDate(p.start_date)} />
                <PField label="End Date"             value={fmtDate(p.end_date)} />
              </div>

              {/* ── Section 2: Supervisors ── */}
              <div className="section-label" style={{ marginTop: 20 }}>Supervisors</div>
              <div className="p-grid">
                <PField label="Workplace Supervisor"        value={val(p.workplace_supervisor_name)} />
                <PField label="Workplace Supervisor Email"  value={val(p.workplace_supervisor_email)} />
                <PField label="Academic Supervisor"         value={val(p.academic_supervisor)} />
                <PField label="Academic Supervisor Email"   value={val(p.academic_supervisor_email)} />
              </div>

              {/* ── Section 3: Score / Grade ── */}
              {(p.total_score > 0 || p.final_grade) && (<>
                <div className="section-label" style={{ marginTop: 20 }}>Evaluation Result</div>
                <div className="p-footer">
                  <div className="p-footer-item">
                    Total Score: <b>{parseFloat(p.total_score).toFixed(2)}%</b>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="p-score-badge">
                      <div>
                        <div className="p-score-label">Weighted Score</div>
                        <div className="p-score-val">{parseFloat(p.total_score).toFixed(1)}%</div>
                      </div>
                    </div>
                    {p.final_grade && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', marginBottom: 4 }}>GRADE</div>
                        <GradeBadge grade={p.final_grade} />
                      </div>
                    )}
                  </div>
                </div>
              </>)}

              {/* ── Section 4: Description ── */}
              {p.description && (<>
                <div className="section-label" style={{ marginTop: 20 }}>Description / Notes</div>
                <div className="p-description">{p.description}</div>
              </>)}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <button className="btn btn-primary" onClick={() => setTab('logbook')}>✏️ Submit Weekly Log</button>
                <button className="btn btn-ghost"   onClick={() => setTab('history')}>📋 View Log History</button>
              </div>

            </>) : (
              <div className="no-placement">
                <div className="no-placement-icon">🏢</div>
                <div>
                  <h4>No placement assigned yet</h4>
                  <p>
                    Your internship placement details will appear here once the administrator
                    assigns you to an organisation. Please contact your internship coordinator
                    if you believe this is an error.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ LOGBOOK ══════════════════════════════════════════════════════════ */}
        {tab === 'logbook' && (
          <div className="panel" style={{ maxWidth: 700 }}>
            <div className="panel-title">Submit Weekly Log Entry</div>
            <div className="panel-sub">
              Record what you did this week. Save as Draft to edit later, or Submit to send for supervisor review.
            </div>

            <div className="workflow-guide">
              <span className="wf-step s-draft">📝 Draft</span>
              <span className="wf-arrow">→</span>
              <span className="wf-step s-submitted">📤 Submitted</span>
              <span className="wf-arrow">→</span>
              <span className="wf-step s-reviewed">🔍 Reviewed</span>
              <span className="wf-arrow">→</span>
              <span className="wf-step s-approved">✅ Approved</span>
            </div>

              <hr className="divider" />

            {alert.text && (
              <div className={`alert ${alert.type}`}>
                <span className="alert-icon">{alert.type === 'success' ? '✓' : '✕'}</span>
                <div>{alert.text}</div>
              </div>
            )}

            <div className="section-label">1 · Week Details</div>

            <div className="fg">
              <label className="flabel">Week Number <span className="req">*</span></label>
              <input type="number" name="weekNumber" className="finput narrow"
                value={form.weekNumber} onChange={handleChange} placeholder="e.g. 7" min="1" max="52" />
            </div>

            <div className="form-row">
              <div className="fg">
                <label className="flabel">Week Start Date <span className="req">*</span></label>
                <input type="date" name="weekStartDate" className="finput"
                  value={form.weekStartDate} onChange={handleChange} />
              </div>
              <div className="fg">
                <label className="flabel">Week End Date <span className="req">*</span></label>
                <input type="date" name="weekEndDate" className="finput"
                  value={form.weekEndDate} onChange={handleChange} />
              </div>
            </div>

            <hr className="divider" />
            <div className="section-label">2 · Work Report</div>

            <div className="fg">
              <label className="flabel">Tasks &amp; Activities Undertaken <span className="req">*</span></label>
              <textarea name="activities" className="ftextarea" value={form.activities}
                onChange={handleChange}
                placeholder="Describe the tasks assigned to you, tools or technologies used, meetings attended, code written, reports produced, or any other work done this week…"
                rows={6} />
              <div className="char-count">{form.activities.length} characters</div>
            </div>

            <div className="fg">
              <label className="flabel">Challenges Faced &amp; Lessons Learned</label>
              <textarea name="challenges" className="ftextarea" value={form.challenges}
                onChange={handleChange}
                placeholder="Describe any blockers, how you resolved them, and key skills or insights gained this week…"
                rows={4} />
              <div className="char-count">{form.challenges.length} characters</div>
            </div>

            <hr className="divider" />

            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.65 }}>
              <b>Save as Draft</b> — stores your entry privately so you can edit it before submitting.<br />
              <b>Submit Logbook</b> — sends the entry to your workplace supervisor for review. Cannot be edited after submission.
            </div>

            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => submitLog('draft')} disabled={submitting}>
                {submitting ? '…' : '💾 Save as Draft'}
              </button>
              <button className="btn btn-primary" onClick={() => submitLog('submitted')} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Logbook →'}
              </button>
            </div>
          </div>
        )}

        {/* ══ HISTORY ══════════════════════════════════════════════════════════ */}
        {tab === 'history' && (
          <div className="panel">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div className="panel-title">All Weekly Log Entries</div>
                <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 3 }}>
                  {dash.recentLogs.length > 0
                    ? `${dash.recentLogs.length} log${dash.recentLogs.length !== 1 ? 's' : ''} on record`
                    : 'No entries yet'}
                </div>
              </div>
              <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}
                onClick={() => setTab('logbook')}>+ New Log</button>
            </div>

            {dash.recentLogs.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                {['draft','submitted','reviewed','approved'].map(s => (
                  <span key={s} className={`status-pill s-${s}`}>{s}</span>
                ))}
              </div>

            {dash.recentLogs.length > 0 ? (
              <div className="log-list">
                {dash.recentLogs.map((log, i) => (
                  <div className="log-item" key={log.id ?? i}>
                    <div className="log-week">W<br />{log.week_number ?? i + 1}</div>
                    <div className="log-info">
                      <div className="log-title">
                        {log.activities?.slice(0, 80)}{log.activities?.length > 80 ? '…' : ''}
                      </div>
                      <div className="log-date">
                        {fmtDate(log.week_start_date)}
                        {log.challenges && <span style={{ marginLeft: 8, color: '#94A3B8' }}>· Has challenges note</span>}
                      </div>
                    </div>
                    <span className={`status-pill s-${log.status?.toLowerCase()}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <h4>No logs submitted yet</h4>
                <p>Your weekly log entries will appear here<br />once you submit them through the logbook.</p>
                <button className="cta-btn" onClick={() => setTab('logbook')}>✏️ Submit your first log →</button>
              </div>
            )}
          </div>
        )}

      </main>
    </div></>
  );
}
