import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#378ADD', '#1D9E75', '#EF9F27', '#E24B4A', '#7F77DD', '#D4537E', '#639922'];
const REFRESH_INTERVAL = 30000;

const DATE_RANGES = [
  { label: 'Last 7 days',  value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time',     value: 'all' },
];

const StatCard = ({ label, value, accentColor, icon, dark }) => (
  <div style={{
    flex: 1,
    background: dark ? '#1e293b' : '#fff',
    borderRadius: 12,
    padding: '18px 22px',
    borderTop: `3px solid ${accentColor}`,
    boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
    border: dark ? '1px solid #334155' : 'none',
    minWidth: '220px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {label}
      </p>
      <span style={{ fontSize: 18, opacity: 0.5 }}>{icon}</span>
    </div>
    <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 700, color: dark ? '#f1f5f9' : '#1e293b', lineHeight: 1 }}>
      {value}
    </p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e293b', color: '#f1f5f9',
      padding: '8px 14px', borderRadius: 8, fontSize: 13,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ margin: '2px 0 0', color: '#94a3b8' }}>{payload[0].value} submissions</p>
    </div>
  );
};

const DrillDownModal = ({ student, onClose, dark }) => {
  if (!student) return null;
  const overlay = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const modal = {
    background: dark ? '#1e293b' : '#fff',
    borderRadius: 16, padding: 28, width: 360,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    border: dark ? '1px solid #334155' : 'none',
  };
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: dark ? '#f1f5f9' : '#1e293b' }}>
            {student.student__username}
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: dark ? '#94a3b8' : '#64748b', lineHeight: 1,
          }}>×</button>
        </div>
        {[
          ['Total submissions', student.logs_count],
          ['Completion rate', `${Math.min(100, Math.round((student.logs_count / 15) * 100))}%`],
          ['Last active', 'Today'],
          ['Status', student.logs_count >= 10 ? '✅ On track' : '⚠️ Needs attention'],
        ].map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: `1px solid ${dark ? '#334155' : '#f1f5f9'}`,
            fontSize: 14,
          }}>
            <span style={{ color: dark ? '#94a3b8' : '#64748b' }}>{k}</span>
            <span style={{ fontWeight: 600, color: dark ? '#f1f5f9' : '#1e293b' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const exportCSV = (data) => {
  const header = 'Student,Log Count\n';
  const rows = data.map(d => `${d.student__username},${d.logs_count}`).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportJSON = (stats) => {
  const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const Dashboard = () => {
  const [stats, setStats] = useState({ student_progress: [], pending_reviews_count: 0, admin_performance: {} });
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [dark, setDark]               = useState(false);
  const [dateRange, setDateRange]     = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch]           = useState('');
  const [sortKey, setSortKey]         = useState('logs_count');
  const [sortDir, setSortDir]         = useState('desc');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole') || 'Supervisor';
  const displayRole = userRole === 'acad_supervisor' || userRole === 'academic_supervisor' 
    ? 'Academic Supervisor' 
    : userRole === 'work_supervisor' 
    ? 'Workplace Supervisor' 
    : 'Supervisor';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const fetchData = useCallback(() => {
    const token = localStorage.getItem('token') ?? '';
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/dashboard-stats/', {
      headers: { Authorization: `Bearer ${token}` },
      params: { range: dateRange },
    })
      .then(res => {
        setStats(res.data);
        setLastUpdated(new Date());
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data.');
        setLoading(false);
      });
  }, [dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchData, REFRESH_INTERVAL);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchData]);

  const tableData = [...stats.student_progress]
    .filter(d => d.student__username.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = sortKey === 'student__username' ? a[sortKey] : Number(a[sortKey]);
      const bv = sortKey === 'student__username' ? b[sortKey] : Number(b[sortKey]);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const avgScore = stats.admin_performance?.avg_score;
  const avgDisplay = avgScore != null ? `${avgScore.toFixed(1)}%` : '—';

  const bg     = dark ? '#0f172a' : '#f8fafc';
  const panel  = dark ? '#1e293b' : '#fff';
  const border = dark ? '#334155' : '#e2e8f0';
  const text   = dark ? '#f1f5f9' : '#1e293b';
  const muted  = dark ? '#94a3b8' : '#64748b';

  const btn = (active) => ({
    padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
    cursor: 'pointer', border: `1px solid ${active ? '#378ADD' : border}`,
    background: active ? '#378ADD' : 'transparent',
    color: active ? '#fff' : muted, transition: 'all .15s',
  });

  const thStyle = () => ({
    padding: '10px 14px', textAlign: 'left', fontSize: 12,
    fontWeight: 600, color: muted, textTransform: 'uppercase',
    letterSpacing: '.6px', cursor: 'pointer', userSelect: 'none',
    background: dark ? '#162032' : '#f8fafc',
    borderBottom: `1px solid ${border}`,
  });

  const tdStyle = {
    padding: '12px 14px', fontSize: 14,
    borderBottom: `1px solid ${border}`, color: text,
  };

  return (
    <div style={{ background: bg, minHeight: '100vh', transition: 'background .2s' }}>
      
      {/* ── Top Navigation Navbar ── */}
      <nav style={{
        background: dark ? '#1e293b' : '#ffffff',
        borderBottom: `1px solid ${border}`,
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: dark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 900
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#378ADD', color: '#fff', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>I</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: text, letterSpacing: '0.5px' }}>ILES Portal</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71' }}></div>
            <span style={{ fontSize: 14, fontWeight: 500, color: text }}>
              {displayRole} Panel
            </span>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#e24b4a',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Main Layout Body Container ── */}
      <div style={{ padding: 28 }}>
        
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: text }}>System Overview</h2>
            {lastUpdated && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: muted }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>

            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13,
                border: `1px solid ${border}`, background: panel, color: text, cursor: 'pointer',
              }}
            >
              {DATE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>

            <button onClick={() => setAutoRefresh(r => !r)} style={btn(autoRefresh)}>
              {autoRefresh ? '⏸ Live' : '▶ Auto-refresh'}
            </button>

            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowExportMenu(m => !m)} style={btn(false)}>
                Export ▾
              </button>
              {showExportMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%', background: panel,
                  border: `1px solid ${border}`, borderRadius: 10, overflow: 'hidden',
                  zIndex: 100, minWidth: 140, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}>
                  {[
                    ['CSV',  () => { exportCSV(stats.student_progress); setShowExportMenu(false); }],
                    ['JSON', () => { exportJSON(stats); setShowExportMenu(false); }],
                  ].map(([label, action]) => (
                    <button key={label} onClick={action} style={{
                      display: 'block', width: '100%', padding: '10px 16px',
                      textAlign: 'left', background: 'none', border: 'none',
                      fontSize: 13, color: text, cursor: 'pointer',
                    }}
                      onMouseEnter={e => e.target.style.background = dark ? '#334155' : '#f8fafc'}
                      onMouseLeave={e => e.target.style.background = 'none'}
                    >
                      Download {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setDark(d => !d)} style={{ ...btn(false), fontSize: 16, padding: '6px 10px' }}>
              {dark ? '☀️' : '🌙'}
            </button>

            <button onClick={fetchData} style={{ ...btn(false), padding: '6px 10px', fontSize: 16 }} title="Refresh">
              🔄
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5',
            color: '#991b1b', borderRadius: 10, padding: '10px 16px',
            fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <StatCard label="Pending Reviews"  value={loading ? '…' : stats.pending_reviews_count}   accentColor="#E24B4A" icon="📋" dark={dark} />
          <StatCard label="Avg Performance"  value={loading ? '…' : avgDisplay}                     accentColor="#1D9E75" icon="📈" dark={dark} />
          <StatCard label="Active Students"  value={loading ? '…' : stats.student_progress.length}  accentColor="#378ADD" icon="🎓" dark={dark} />
        </div>

        {/* ── Bar Chart ── */}
        <div style={{
          background: panel, borderRadius: 12, padding: 24,
          boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          border: dark ? `1px solid ${border}` : 'none',
          marginBottom: 24,
        }}>
          <p style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: muted }}>
            Weekly Log Submissions
          </p>
          {loading ? (
            <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, fontSize: 13 }}>Loading…</div>
          ) : stats.student_progress.length === 0 ? (
            <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, fontSize: 13 }}>No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.student_progress} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={dark ? '#1e3a5f' : '#f1f5f9'} />
                <XAxis dataKey="student__username" axisLine={false} tickLine={false} tick={{ fill: muted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: muted, fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: dark ? '#1e3a5f' : '#f8fafc' }} />
                <Bar dataKey="logs_count" radius={[6, 6, 0, 0]} maxBarSize={56} style={{ cursor: 'pointer' }} onClick={(data) => setSelectedStudent(data)}>
                  {stats.student_progress.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          <p style={{ margin: '12px 0 0', fontSize: 12, color: muted }}>Click a bar to view student details</p>
        </div>

        {/* ── Student Table ── */}
        <div style={{
          background: panel, borderRadius: 12,
          border: dark ? `1px solid ${border}` : 'none',
          boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${border}`, flexWrap: 'wrap', gap: 10 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: muted }}>Student Log Table</p>
            <input
              placeholder="Search students…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13,
                border: `1px solid ${border}`, background: dark ? '#0f172a' : '#f8fafc',
                color: text, outline: 'none', width: 200,
              }}
            />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[
                  ['student__username', 'Student'],
                  ['logs_count', 'Log Count'],
                  ['completion', 'Completion'],
                  ['status', 'Status'],
                ].map(([key, label]) => (
                  <th key={key} style={thStyle()} onClick={() => toggleSort(key)}>
                    {label} {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
                <th style={thStyle()}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: muted }}>Loading…</td></tr>
              ) : tableData.length === 0 ? (
                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: muted }}>No students found</td></tr>
              ) : tableData.map((row, i) => {
                const completion = Math.min(100, Math.round((row.logs_count / 15) * 100));
                const onTrack = row.logs_count >= 10;
                return (
                  <tr key={i}
                    onMouseEnter={e => e.currentTarget.style.background = dark ? '#162032' : '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: COLORS[i % COLORS.length] + '30',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: COLORS[i % COLORS.length],
                        }}>
                          {row.student__username ? row.student__username[0].toUpperCase() : 'S'}
                        </div>
                        {row.student__username}
                      </div>
                    </td>
                    <td style={tdStyle}>{row.logs_count}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: dark ? '#334155' : '#e2e8f0', borderRadius: 99 }}>
                          <div style={{
                            height: '100%', width: `${completion}%`,
                            background: onTrack ? '#1D9E75' : '#EF9F27',
                            borderRadius: 99,
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: muted, minWidth: 34 }}>{completion}%</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                        background: onTrack ? '#dcfce7' : '#fef9c3',
                        color: onTrack ? '#166534' : '#854d0e',
                      }}>
                        {onTrack ? 'On track' : 'Needs attention'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => setSelectedStudent(row)}
                        style={{
                          padding: '4px 12px', borderRadius: 7, fontSize: 12,
                          border: `1px solid ${border}`, background: 'none',
                          color: muted, cursor: 'pointer',
                        }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Drill-down Modal ── */}
        <DrillDownModal student={selectedStudent} onClose={() => setSelectedStudent(null)} dark={dark} />

      </div>
    </div>
  );
};

export default Dashboard;