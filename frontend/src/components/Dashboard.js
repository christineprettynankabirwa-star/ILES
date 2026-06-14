import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Spinner } from '../components/UI';

const GRADE_COLORS = { A: '#3B6D11', B: '#0F6E56', C: '#BA7517', D: '#854F0B', F: '#A32D2D', '': '#888780' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    setLoading(true);
    api.get(`/dashboard-stats/?range=${range}`)
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) return <Spinner />;
  if (!stats) return <div className="alert alert-error">Failed to load dashboard.</div>;

  const role = user?.role;
  const progress = stats.student_progress || [];
  const adminStats = stats.admin_performance;
  const gradeData = adminStats?.grade_distribution || [];

  const scoreData = progress.map(p => ({
    name: p.student__username,
    score: parseFloat(p.total_score) || 0,
    logs: p.logs_count,
  }));

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            {role === 'student' ? 'My Dashboard' :
             role === 'work_supervisor' ? 'Supervisor Dashboard' :
             role === 'acad_supervisor' ? 'Academic Dashboard' : 'Admin Dashboard'}
          </h1>
          <p>
            {role === 'student' ? 'Track your internship progress and logs' :
             role === 'work_supervisor' ? 'Monitor student activity logs' :
             'Internship management overview'}
          </p>
        </div>
        <select
          className="filter-select"
          value={range}
          onChange={e => setRange(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card accent-blue">
          <div className="label">Total Placements</div>
          <div className="value">{progress.length}</div>
          <div className="sub">Active internships</div>
        </div>
        <div className="stat-card accent-amber">
          <div className="label">Pending Reviews</div>
          <div className="value">{stats.pending_reviews_count}</div>
          <div className="sub">Logs awaiting review</div>
        </div>
        {role === 'student' && progress[0] && (
          <>
            <div className="stat-card accent-green">
              <div className="label">Logs Submitted</div>
              <div className="value">{progress[0].logs_count}</div>
              <div className="sub">Weekly logs filed</div>
            </div>
            <div className="stat-card accent-blue">
              <div className="label">Current Grade</div>
              <div className="value">{progress[0].final_grade || '—'}</div>
              <div className="sub">Score: {parseFloat(progress[0].total_score || 0).toFixed(1)}</div>
            </div>
          </>
        )}
        {adminStats && (
          <>
            <div className="stat-card accent-green">
              <div className="label">Avg Score</div>
              <div className="value">{adminStats.avg_score ? adminStats.avg_score.toFixed(1) : '—'}</div>
              <div className="sub">Across all evaluations</div>
            </div>
            <div className="stat-card accent-red">
              <div className="label">Total Evaluations</div>
              <div className="value">{adminStats.total_evals}</div>
              <div className="sub">Completed assessments</div>
            </div>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ gap: 20, marginTop: 4 }}>
        {/* Student Scores / Logs Chart */}
        {scoreData.length > 0 && (
          <div className="card">
            <div className="card-title">
              {role === 'student' ? 'My Log Progress' : 'Student Log Activity'}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scoreData.slice(0, 10)} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="logs" fill="#185FA5" name="Logs" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Grade Distribution (admin/supervisor) */}
        {gradeData.length > 0 ? (
          <div className="card">
            <div className="card-title">Grade distribution</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={gradeData}
                  dataKey="count"
                  nameKey="final_grade"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ final_grade, count }) => `${final_grade || 'N/A'}: ${count}`}
                  labelLine={false}
                >
                  {gradeData.map((entry, i) => (
                    <Cell key={i} fill={GRADE_COLORS[entry.final_grade] || '#888'} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card">
            <div className="card-title">Score comparison</div>
            {scoreData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreData.slice(0, 10)} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="score" fill="#0F6E56" name="Score" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <p>No score data yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Progress Table */}
      {progress.length > 0 && role !== 'student' && (
        <div className="card mt-24">
          <div className="card-title">Student progress</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Logs Filed</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {progress.map(p => {
                  const score = parseFloat(p.total_score) || 0;
                  return (
                    <tr key={p.student__id}>
                      <td><strong>{p.student__username}</strong></td>
                      <td>{p.logs_count}</td>
                      <td>{score.toFixed(1)}</td>
                      <td>
                        {p.final_grade
                          ? <span className={`badge badge-${p.final_grade}`}>{p.final_grade}</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td style={{ minWidth: 120 }}>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${score}%` }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>{score.toFixed(0)}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
