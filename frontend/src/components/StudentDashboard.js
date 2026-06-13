import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const C = {
  ink:         '#0F172A',
  inkMid:      '#334155',
  inkLight:    '#64748B',
  border:      '#E2E8F0',
  surface:     '#FFFFFF',
  bg:          '#F8FAFC',
  accent:      '#6366F1',
  accentSoft:  '#EEF2FF',
  accentDark:  '#4338CA',
  success:     '#059669',
  successSoft: '#ECFDF5',
  warn:        '#D97706',
  warnSoft:    '#FFFBEB',
  danger:      '#DC2626',
  dangerSoft:  '#FEF2F2',
  purple:      '#7C3AED',
  purpleSoft:  '#F5F3FF',
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #F8FAFC; color: #0F172A; -webkit-font-smoothing: antialiased; }
  .shell { display: flex; min-height: 100vh; }
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
  .main { flex: 1; padding: 36px 40px; overflow-y: auto; min-width: 0; background: #F8FAFC; }
  .topbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
  .topbar-title { font-size: 22px; font-weight: 700; color: #0F172A; }
  .topbar-sub { font-size: 13.5px; color: #64748B; margin-top: 4px; }
  .placement-chip { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; font-size: 12.5px; font-weight: 500; color: #334155; white-space: nowrap; flex-shrink: 0; }
  .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .dot.green { background: #059669; }
  .dot.orange { background: #D97706; }
  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 10px 10px 0 0; }
  .stat-card.c-indigo::before { background: #6366F1; }
  .stat-card.c-purple::before { background: #7C3AED; }
  .stat-card.c-green::before  { background: #059669; }
  .stat-card.c-amber::before  { background: #D97706; }
  .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #64748B; margin-bottom: 10px; }
  .stat-value { font-size: 34px; font-weight: 700; font-family: 'DM Mono', monospace; line-height: 1; color: #0F172A; }
  .stat-value.indigo { color: #6366F1; }
  .stat-value.purple { color: #7C3AED; }
  .stat-value.green  { color: #059669; }
  .stat-value.amber  { color: #D97706; }
  .stat-meta { font-size: 12px; color: #64748B; margin-top: 6px; }
  .prog-bg { height: 5px; border-radius: 3px; background: #E2E8F0; margin-top: 10px; overflow: hidden; }
  .prog-fill { height: 100%; border-radius: 3px; background: #6366F1; transition: width 0.6s ease; }
  .panel { background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 26px; }
  .panel + .panel { margin-top: 24px; }
  .panel-head { margin-bottom: 20px; }
  .panel-title { font-size: 14px; font-weight: 700; color: #0F172A; }
  .panel-sub { font-size: 12.5px; color: #64748B; margin-top: 3px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .form-row { display: flex; gap: 14px; }
  .form-row .fg { flex: 1; }
  .fg { margin-bottom: 18px; }
  .fg:last-child { margin-bottom: 0; }
  .flabel { display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 6px; letter-spacing: 0.02em; }
  .flabel .req { color: #DC2626; margin-left: 2px; }
  .finput, .ftextarea { width: 100%; padding: 9px 12px; border: 1px solid #E2E8F0; border-radius: 7px; font-size: 13.5px; font-family: 'Inter', sans-serif; color: #0F172A; background: #F8FAFC; transition: border 0.15s, box-shadow 0.15s; outline: none; }
  .finput:focus, .ftextarea:focus { border-color: #6366F1; box-shadow: 0 0 0 3px #EEF2FF; background: #fff; }
  .finput::placeholder, .ftextarea::placeholder { color: #94A3B8; }
  .ftextarea { resize: vertical; }
  .finput.narrow { max-width: 130px; }
  .char-count { font-size: 11px; color: #94A3B8; text-align: right; margin-top: 4px; }
  .btn-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 22px; }
  .btn { padding: 9px 20px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'Inter', sans-serif; transition: background 0.15s, transform 0.1s; display: flex; align-items: center; gap: 6px; }
  .btn:active { transform: scale(0.98); }
  .btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .btn-ghost { background: #F1F5F9; color: #334155; border: 1px solid #E2E8F0; }
  .btn-ghost:hover:not(:disabled) { background: #E2E8F0; }
  .btn-primary { background: #6366F1; color: #fff; }
  .btn-primary:hover:not(:disabled) { background: #4338CA; }
  .alert { display: flex; align-items: flex-start; gap: 9px; padding: 11px 14px; border-radius: 7px; font-size: 13px; font-weight: 500; margin-bottom: 18px; }
  .alert.success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
  .alert.error   { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
  .alert-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .workflow-guide { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; align-items: center; }
  .wf-step { display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }
  .wf-arrow { font-size: 12px; color: #94A3B8; }
  .log-list { display: flex; flex-direction: column; gap: 10px; }
  .log-item { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border-radius: 8px; border: 1px solid #E2E8F0; background: #F8FAFC; transition: border-color 0.15s; }
  .log-item:hover { border-color: #C7D2FE; }
  .log-week { width: 40px; height: 40px; border-radius: 8px; background: #EEF2FF; color: #6366F1; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 11.5px; font-weight: 600; flex-shrink: 0; line-height: 1.2; text-align: center; }
  .log-info { flex: 1; min-width: 0; }
  .log-title { font-size: 13px; font-weight: 600; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .log-date  { font-size: 11.5px; color: #64748B; margin-top: 2px; }
  .status-pill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; font-family: 'DM Mono', monospace; }
  .s-Draft     { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }
  .s-Submitted { background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; }
  .s-Reviewed  { background: #F5F3FF; color: #7C3AED; border: 1px solid #DDD6FE; }
  .s-Approved  { background: #ECFDF5; color: #059669; border: 1px solid #6EE7B7; }
  .divider { border: none; border-top: 1px solid #E2E8F0; margin: 24px 0; }
  .empty { text-align: center; padding: 48px 20px; color: #94A3B8; }
  .empty-icon { font-size: 36px; margin-bottom: 12px; }
  .empty h4 { font-size: 14px; font-weight: 600; color: #64748B; margin-bottom: 6px; }
  .empty p  { font-size: 13px; line-height: 1.6; }
  .empty .cta-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; padding: 8px 18px; background: #6366F1; color: #fff; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
  .empty .cta-btn:hover { background: #4338CA; }
  .spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid #E2E8F0; border-top-color: #6366F1; animation: spin 0.75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 14px; background: #F8FAFC; }
  .loading p { font-size: 13px; color: #64748B; font-weight: 500; }
  .info-banner { display: flex; align-items: flex-start; gap: 10px; background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 8px; padding: 12px 14px; font-size: 12.5px; color: #3730A3; margin-bottom: 20px; line-height: 1.5; }
  .info-banner b { font-weight: 600; }
  .mobile-tabs { display: none; overflow-x: auto; gap: 4px; padding-bottom: 16px; margin-bottom: 8px; }
  .m-tab { padding: 7px 16px; border-radius: 6px; white-space: nowrap; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid #E2E8F0; background: #fff; color: #64748B; font-family: 'Inter', sans-serif; }
  .m-tab.active { background: #6366F1; color: #fff; border-color: #6366F1; }
  @media (max-width: 1100px) {
    .mobile-tabs { display: flex; }
    .main { padding: 24px 20px; }
    .sidebar { display: none; }
  }
`;

const API = 'http://127.0.0.1:8000/api';

const authHeaders = () => {
  const t = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
};

const initials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'ST';

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const NAV = [
  { id: 'overview',    icon: '🏠', label: 'Overview' },
  { id: 'logbook',     icon: '✏️',  label: 'Weekly Logbook', badge: 'NEW' },
  { id: 'history',     icon: '📋', label: 'Log History' },
  { id: 'performance', icon: '📈', label: 'Performance' },
];

const EMPTY_FORM = { weekNumber: '', weekStartDate: '', weekEndDate: '', activities: '', challenges: '' };

export default function StudentDashboard() {
  const [tab,        setTab]        = useState('overview');
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert,      setAlert]      = useState({ type: '', text: '' });
  const [form,       setForm]       = useState(EMPTY_FORM);

  const [dash, setDash] = useState({
    studentName: 'Student', studentId: '',
    placement: { company: 'Not yet assigned', status: 'Pending' },
    metrics: { totalWeeksSubmitted: 0, pendingWeeks: 0, approvedWeeks: 0, totalWeeks: 12 },
    weeklyPerformance: [], recentLogs: []
  });

  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem('user');
        const user = stored ? JSON.parse(stored) : null;
        const [mRes, lRes] = await Promise.all([
          fetch(`${API}/student/dashboard-metrics/`, { headers: authHeaders() }),
          fetch(`${API}/logs/?ordering=-week_number&limit=20`, { headers: authHeaders() })
        ]);
        const mData = mRes.ok ? await mRes.json() : null;
        const lData = lRes.ok ? await lRes.json() : null;
        setDash(prev => ({
          ...prev,
          studentName:       user?.name || user?.username || mData?.student_name || 'Student',
          studentId:         user?.student_id || mData?.student_id || '',
          placement:         mData?.placement         ?? prev.placement,
          metrics:           mData?.metrics           ?? prev.metrics,
          weeklyPerformance: mData?.weekly_performance ?? [],
          recentLogs:        lData?.results ?? lData   ?? []
        }));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flash = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: '', text: '' }), 6000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitLog = async (targetStatus) => {
    const { weekNumber, weekStartDate, weekEndDate, activities } = form;
    if (!weekNumber) { flash('error', 'Please enter the week number.'); return; }
    if (!weekStartDate || !weekEndDate) { flash('error', 'Please select both start and end dates.'); return; }
    if (new Date(weekEndDate) < new Date(weekStartDate)) { flash('error', 'End date cannot be before start date.'); return; }
    if (!activities.trim()) { flash('error', 'Activities & tasks field is required.'); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/logs/`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          week_number:     parseInt(weekNumber, 10),
          week_start_date: weekStartDate,
          week_end_date:   weekEndDate,
          activities:      activities.trim(),
          challenges:      form.challenges.trim(),
          status:          targetStatus
        })
      });

      if (res.ok) {
        const newLog = await res.json();
        flash('success',
          targetStatus === 'Draft'
            ? `Week ${weekNumber} saved as Draft — you can edit it later.`
            : `Week ${weekNumber} submitted! Your supervisor will review it.`
        );
        if (targetStatus === 'Submitted') {
          setDash(prev => ({
            ...prev,
            metrics: { ...prev.metrics, totalWeeksSubmitted: prev.metrics.totalWeeksSubmitted + 1, pendingWeeks: prev.metrics.pendingWeeks + 1 },
            recentLogs: [newLog, ...prev.recentLogs]
          }));
        } else {
          setDash(prev => ({ ...prev, recentLogs: [newLog, ...prev.recentLogs] }));
        }
        setForm(EMPTY_FORM);
        setTimeout(() => setTab('history'), 1200);
      } else {
        const errBody = await res.json().catch(() => ({}));
        flash('error', errBody?.detail || errBody?.non_field_errors?.[0] || Object.values(errBody)?.[0]?.[0] || 'Submission failed — check your inputs.');
      }
    } catch {
      flash('error', 'Cannot reach the server. Make sure Django is running on port 8000.');
    } finally {
      setSubmitting(false);
    }
  };

  const total     = dash.metrics.totalWeeks || 12;
  const submitted = dash.metrics.totalWeeksSubmitted;
  const pct       = Math.round((submitted / total) * 100);
  const isPending = dash.placement.status?.toLowerCase() === 'pending';
  const avgScore  = dash.weeklyPerformance.length
    ? Math.round(dash.weeklyPerformance.reduce((s, w) => s + (w.score || 0), 0) / dash.weeklyPerformance.length)
    : null;

  if (loading) return (
    <><style>{CSS}</style>
    <div className="loading"><div className="spinner" /><p>Loading your dashboard…</p></div></>
  );

  return (
    <><style>{CSS}</style>
    <div className="shell">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-pill">ILES · CSC 1202</div>
          <div className="sb-title">Internship Logging<br />&amp; Evaluation System</div>
          <div className="sb-sub">2026 Academic Year</div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section-label">Student Portal</div>
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn${tab === n.id ? ' active' : ''}`} onClick={() => setTab(n.id)}>
              <span className="icon">{n.icon}</span>
              {n.label}
              {n.badge && <span className="nav-badge">{n.badge}</span>}
              {n.id === 'history' && dash.recentLogs.length > 0 && <span className="nav-count">{dash.recentLogs.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sb-footer">
          <div className="sb-user">
            <div className="avatar">{initials(dash.studentName)}</div>
            <div>
              <div className="sb-user-name">{dash.studentName}</div>
              <div className="sb-user-role">{dash.studentId ? `ID: ${dash.studentId}` : 'Student Intern'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main">

        {/* Mobile tabs */}
        <div className="mobile-tabs">
          {NAV.map(n => (
            <button key={n.id} className={`m-tab${tab === n.id ? ' active' : ''}`} onClick={() => setTab(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>

        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">
              {tab === 'overview'    && `Welcome back, ${dash.studentName.split(' ')[0]} 👋`}
              {tab === 'logbook'     && 'Weekly Logbook ✏️'}
              {tab === 'history'     && 'Log History 📋'}
              {tab === 'performance' && 'Performance 📈'}
            </div>
            <div className="topbar-sub">
              {tab === 'overview'    && "Here's a summary of your internship progress."}
              {tab === 'logbook'     && 'Fill in and submit your weekly work log below.'}
              {tab === 'history'     && 'All your submitted weekly logs and their current status.'}
              {tab === 'performance' && 'Your evaluation scores from supervisor and academic reviews.'}
            </div>
          </div>
          <div className="placement-chip">
            <div className={`dot ${isPending ? 'orange' : 'green'}`} />
            <strong>{dash.placement.company}</strong>
            <span style={{ color: '#94A3B8' }}>·</span>
            <span>{dash.placement.status}</span>
          </div>
        </div>

        {/* ══ OVERVIEW ══ */}
        {tab === 'overview' && (<>
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

          {submitted < total && (
            <div className="info-banner">
              <span>💡</span>
              <div>
                <b>Don't forget your weekly log.</b> You have {total - submitted} week{total - submitted !== 1 ? 's' : ''} remaining.{' '}
                <span onClick={() => setTab('logbook')} style={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>
                  Submit now →
                </span>
              </div>
            </div>
          )}

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Evaluation Score Trend</div>
              <div className="panel-sub">Weekly performance from supervisor and academic reviews (0–100%)</div>
            </div>
            <div style={{ height: 290 }}>
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
                    <Tooltip contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} formatter={v => [`${v}%`, 'Score']} />
                    <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2.5} fill="url(#sg)"
                      dot={{ r: 4, fill: '#6366F1', strokeWidth: 0 }} activeDot={{ r: 6 }} name="Score" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty">
                  <div className="empty-icon">📊</div>
                  <h4>No scores yet</h4>
                  <p>Scores appear here once your supervisor<br />reviews and grades your submitted logs.</p>
                </div>
              )}
            </div>
          </div>

          {dash.recentLogs.length > 0 && (
            <div className="panel">
              <div className="panel-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div className="panel-title">Recent Logs</div>
                  <div className="panel-sub">Your last {Math.min(dash.recentLogs.length, 4)} entries</div>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setTab('history')}>View all →</button>
              </div>
              <div className="log-list">
                {dash.recentLogs.slice(0, 4).map((log, i) => (
                  <div className="log-item" key={log.id ?? i}>
                    <div className="log-week">W<br />{log.week_number ?? i + 1}</div>
                    <div className="log-info">
                      <div className="log-title">{log.activities?.slice(0, 72)}{log.activities?.length > 72 ? '…' : ''}</div>
                      <div className="log-date">{fmtDate(log.week_start_date)} – {fmtDate(log.week_end_date)}</div>
                    </div>
                    <span className={`status-pill s-${log.status}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>)}

        {/* ══ LOGBOOK ══ */}
        {tab === 'logbook' && (
          <div className="panel" style={{ maxWidth: 700 }}>
            <div className="panel-head">
              <div className="panel-title">Submit your weekly log entry</div>
              <div className="panel-sub">Record what you did each week. Save as Draft to come back later, or Submit to send for supervisor review.</div>
            </div>

            <div className="workflow-guide">
              <span className="wf-step s-Draft">📝 Draft</span>
              <span className="wf-arrow">→</span>
              <span className="wf-step s-Submitted">📤 Submitted</span>
              <span className="wf-arrow">→</span>
              <span className="wf-step s-Reviewed">🔍 Reviewed</span>
              <span className="wf-arrow">→</span>
              <span className="wf-step s-Approved">✅ Approved</span>
            </div>

            <hr className="divider" />

            {alert.text && (
              <div className={`alert ${alert.type}`}>
                <span className="alert-icon">{alert.type === 'success' ? '✓' : '✕'}</span>
                {alert.text}
              </div>
            )}

            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
              1 · Week Details
            </div>

            <div className="fg">
              <label className="flabel">Week Number <span className="req">*</span></label>
              <input type="number" name="weekNumber" className="finput narrow"
                value={form.weekNumber} onChange={handleChange} placeholder="e.g. 7" min="1" max="12" />
            </div>

            <div className="form-row">
              <div className="fg">
                <label className="flabel">Week Start Date <span className="req">*</span></label>
                <input type="date" name="weekStartDate" className="finput" value={form.weekStartDate} onChange={handleChange} />
              </div>
              <div className="fg">
                <label className="flabel">Week End Date <span className="req">*</span></label>
                <input type="date" name="weekEndDate" className="finput" value={form.weekEndDate} onChange={handleChange} />
              </div>
            </div>

            <hr className="divider" />

            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
              2 · Work Report
            </div>

            <div className="fg">
              <label className="flabel">Tasks &amp; Activities Undertaken <span className="req">*</span></label>
              <textarea name="activities" className="ftextarea" value={form.activities} onChange={handleChange}
                placeholder="Describe the tasks assigned to you, tools or technologies used, meetings attended, code written, reports produced, or any other work done this week…"
                rows={6} />
              <div className="char-count">{form.activities.length} characters</div>
            </div>

            <div className="fg">
              <label className="flabel">Challenges Faced &amp; Lessons Learned</label>
              <textarea name="challenges" className="ftextarea" value={form.challenges} onChange={handleChange}
                placeholder="Describe any blockers or difficulties, how you resolved them, and key skills or insights gained this week…"
                rows={4} />
              <div className="char-count">{form.challenges.length} characters</div>
            </div>

            <hr className="divider" />

            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, marginBottom: 4 }}>
              <strong>Save as Draft</strong> — stores your entry privately so you can edit it later.<br />
              <strong>Submit Logbook</strong> — sends the entry to your supervisor for review. You cannot edit after submission.
            </div>

            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => submitLog('Draft')} disabled={submitting}>
                {submitting ? '…' : '💾 Save as Draft'}
              </button>
              <button className="btn btn-primary" onClick={() => submitLog('Submitted')} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Logbook →'}
              </button>
            </div>
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {tab === 'history' && (
          <div className="panel">
            <div className="panel-head" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div className="panel-title">All Weekly Log Entries</div>
                <div className="panel-sub">{dash.recentLogs.length > 0 ? `${dash.recentLogs.length} log${dash.recentLogs.length !== 1 ? 's' : ''} on record` : 'No entries yet'}</div>
              </div>
              <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 14px' }} onClick={() => setTab('logbook')}>+ New Log</button>
            </div>

            {dash.recentLogs.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                {['Draft','Submitted','Reviewed','Approved'].map(s => (
                  <span key={s} className={`status-pill s-${s}`}>{s}</span>
                ))}
              </div>
            )}

            {dash.recentLogs.length > 0 ? (
              <div className="log-list">
                {dash.recentLogs.map((log, i) => (
                  <div className="log-item" key={log.id ?? i}>
                    <div className="log-week">W<br />{log.week_number ?? i + 1}</div>
                    <div className="log-info">
                      <div className="log-title">{log.activities?.slice(0, 80)}{log.activities?.length > 80 ? '…' : ''}</div>
                      <div className="log-date">
                        {fmtDate(log.week_start_date)} – {fmtDate(log.week_end_date)}
                        {log.challenges && <span style={{ marginLeft: 8, color: '#94A3B8' }}>· Has challenges note</span>}
                      </div>
                    </div>
                    <span className={`status-pill s-${log.status}`}>{log.status}</span>
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

        {/* ══ PERFORMANCE ══ */}
        {tab === 'performance' && (<>
          {dash.weeklyPerformance.length > 0 && (
            <div className="stats-row" style={{ marginBottom: 24 }}>
              <div className="stat-card c-indigo">
                <div className="stat-label">Average Score</div>
                <div className="stat-value indigo">{avgScore}%</div>
                <div className="stat-meta">across all reviews</div>
              </div>
              <div className="stat-card c-green">
                <div className="stat-label">Best Week</div>
                <div className="stat-value green">{Math.max(...dash.weeklyPerformance.map(w => w.score))}%</div>
                <div className="stat-meta">highest score</div>
              </div>
              <div className="stat-card c-purple">
                <div className="stat-label">Weeks Graded</div>
                <div className="stat-value purple">{dash.weeklyPerformance.length}</div>
                <div className="stat-meta">evaluation records</div>
              </div>
            </div>
          )}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Weekly Evaluation Scores</div>
              <div className="panel-sub">Computed from supervisor review (40%) + academic evaluation (30% + 30%)</div>
            </div>
            <div style={{ height: 360 }}>
              {dash.weeklyPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dash.weeklyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0,100]} tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} formatter={v => [`${v}%`, 'Evaluation Score']} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2.5}
                      dot={{ r: 5, fill: '#6366F1', strokeWidth: 0 }} activeDot={{ r: 7 }} name="Evaluation Score (%)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty">
                  <div className="empty-icon">📈</div>
                  <h4>No evaluation data yet</h4>
                  <p>Scores appear here once your supervisor<br />reviews and grades your submitted logs.</p>
                </div>
              )}
            </div>
          </div>
        </>)}

      </main>
    </div></>
  );
}