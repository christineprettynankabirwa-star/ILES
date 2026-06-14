import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Spinner, Badge, EmptyState, Modal } from '../components/UI';

const emptyForm = {
  placement: '',
  attendance_punctuality: '',
  technical_competence: '',
  quality_of_work: '',
  supervisor_comments: '',
};

function ScoreBar({ value, max = 100, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 32, color: 'var(--text)' }}>{value}</span>
    </div>
  );
}

export default function Evaluations() {
  const { user } = useAuth();
  const [evals, setEvals] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const role = user?.role;
  const isAcadSup = role === 'acad_supervisor';
  const isAdmin = role === 'admin';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [evRes, plRes] = await Promise.all([
        api.get('/evaluations/'),
        api.get('/placements/'),
      ]);
      setEvals(evRes.data);
      setPlacements(plRes.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm(emptyForm);
    setErrors({});
    setModal('create');
  };

  const openEdit = ev => {
    setSelected(ev);
    setForm({
      placement: ev.placement,
      attendance_punctuality: ev.attendance_punctuality,
      technical_competence: ev.technical_competence,
      quality_of_work: ev.quality_of_work,
      supervisor_comments: ev.supervisor_comments || '',
    });
    setErrors({});
    setModal('edit');
  };

  const openView = ev => {
    setSelected(ev);
    setModal('view');
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  // Preview computed score
  const previewScore = () => {
    const a = parseFloat(form.attendance_punctuality) || 0;
    const t = parseFloat(form.technical_competence) || 0;
    const q = parseFloat(form.quality_of_work) || 0;
    return ((a * 0.4) + (t * 0.3) + (q * 0.3)).toFixed(2);
  };

  const previewGrade = () => {
    const s = parseFloat(previewScore());
    if (s >= 80) return 'A';
    if (s >= 70) return 'B';
    if (s >= 60) return 'C';
    if (s >= 50) return 'D';
    return 'F';
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      if (modal === 'create') {
        await api.post('/evaluations/', form);
      } else {
        await api.patch(`/evaluations/${selected.id}/`, form);
      }
      setModal(null);
      load();
    } catch (err) {
      if (err.response?.data) {
        const d = err.response.data;
        if (typeof d === 'string') setErrors({ general: d });
        else if (Array.isArray(d)) setErrors({ general: d.join(' ') });
        else setErrors(d);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this evaluation?')) return;
    await api.delete(`/evaluations/${id}/`);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Evaluations</h1>
          <p>
            {isAcadSup
              ? 'Evaluate student performance using the weighted scoring formula'
              : 'View your evaluation results and final grades'}
          </p>
        </div>
        {(isAcadSup || isAdmin) && (
          <button className="btn btn-primary" onClick={openCreate}>
            + New evaluation
          </button>
        )}
      </div>

      {/* Scoring Formula Info */}
      {(isAcadSup || isAdmin) && (
        <div className="alert alert-info" style={{ marginBottom: 20 }}>
          <strong>Scoring formula:</strong> Attendance & Punctuality (40%) + Technical Competence (30%) + Quality of Work (30%)
        </div>
      )}

      {evals.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📊"
            title="No evaluations yet"
            description={
              isAcadSup
                ? 'Create an evaluation for a student placement.'
                : 'Your evaluation will appear here once submitted by your supervisor.'
            }
            action={isAcadSup && <button className="btn btn-primary" onClick={openCreate}>New evaluation</button>}
          />
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Attendance (40%)</th>
                  <th>Technical (30%)</th>
                  <th>Quality (30%)</th>
                  <th>Total score</th>
                  <th>Grade</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {evals.map(ev => {
                  const score = parseFloat(ev.total_weighted_score || ev.computed_score || 0);
                  const grade = score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F';
                  return (
                    <tr key={ev.id}>
                      <td><strong>{ev.student_name}</strong></td>
                      <td>
                        <ScoreBar value={ev.attendance_punctuality} color="var(--primary)" />
                      </td>
                      <td>
                        <ScoreBar value={ev.technical_competence} color="var(--accent)" />
                      </td>
                      <td>
                        <ScoreBar value={ev.quality_of_work} color="#BA7517" />
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
                          {score.toFixed(1)}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>/100</span>
                      </td>
                      <td>
                        <span className={`badge badge-${grade}`}>{grade}</span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {ev.date_evaluated ? new Date(ev.date_evaluated).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openView(ev)}>View</button>
                          {(isAcadSup || isAdmin) && (
                            <>
                              <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ev)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev.id)}>Delete</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <Modal title="Evaluation details" onClose={() => setModal(null)}>
          {(() => {
            const score = parseFloat(selected.total_weighted_score || selected.computed_score || 0);
            const grade = score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F';
            return (
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={{ textAlign: 'center', padding: '20px', background: 'var(--bg-surface)', borderRadius: 10 }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)' }}>{score.toFixed(1)}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Total weighted score</div>
                  <span className={`badge badge-${grade}`} style={{ fontSize: 16, padding: '6px 20px' }}>{grade}</span>
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Score breakdown</div>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {[
                      { label: 'Attendance & Punctuality', value: selected.attendance_punctuality, weight: '40%', color: 'var(--primary)' },
                      { label: 'Technical Competence', value: selected.technical_competence, weight: '30%', color: 'var(--accent)' },
                      { label: 'Quality of Work', value: selected.quality_of_work, weight: '30%', color: '#BA7517' },
                    ].map(item => (
                      <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13 }}>{item.label}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.weight} · {item.value}/100</span>
                        </div>
                        <ScoreBar value={item.value} color={item.color} />
                      </div>
                    ))}
                  </div>
                </div>

                {selected.supervisor_comments && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Comments</div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)', background: 'var(--bg-surface)', padding: '12px', borderRadius: 8 }}>
                      {selected.supervisor_comments}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'New evaluation' : 'Edit evaluation'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save evaluation'}
              </button>
            </>
          }
        >
          {errors.general && <div className="alert alert-error">{errors.general}</div>}
          {errors.non_field_errors && <div className="alert alert-error">{errors.non_field_errors}</div>}

          <div className="form-group">
            <label className="form-label">Student placement <span className="req">*</span></label>
            <select
              name="placement"
              className="form-control"
              value={form.placement}
              onChange={handleChange}
              disabled={modal === 'edit'}
            >
              <option value="">— Select placement —</option>
              {placements.map(p => (
                <option key={p.id} value={p.id}>
                  {p.student_name} — {p.organization_name}
                </option>
              ))}
            </select>
            {errors.placement && <div className="form-error">{errors.placement}</div>}
          </div>

          {/* Score inputs */}
          {[
            { name: 'attendance_punctuality', label: 'Attendance & Punctuality', weight: '40%', color: 'var(--primary)' },
            { name: 'technical_competence', label: 'Technical Competence', weight: '30%', color: 'var(--accent)' },
            { name: 'quality_of_work', label: 'Quality of Work', weight: '30%', color: '#BA7517' },
          ].map(field => (
            <div className="form-group" key={field.name}>
              <label className="form-label">
                {field.label}
                <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>({field.weight}) — 0 to 100</span>
              </label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  type="number"
                  name={field.name}
                  className="form-control"
                  min="0"
                  max="100"
                  value={form[field.name]}
                  onChange={handleChange}
                  style={{ maxWidth: 90 }}
                />
                <div style={{ flex: 1 }}>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(form[field.name] || 0, 100)}%`,
                        background: field.color,
                      }}
                    />
                  </div>
                </div>
              </div>
              {errors[field.name] && <div className="form-error">{errors[field.name]}</div>}
            </div>
          ))}

          {/* Live score preview */}
          {(form.attendance_punctuality || form.technical_competence || form.quality_of_work) && (
            <div style={{
              background: 'var(--primary-light)',
              borderRadius: 10,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              border: '1px solid rgba(24,95,165,0.2)',
            }}>
              <span style={{ fontSize: 13.5, color: 'var(--primary-dark)' }}>
                Computed total score
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>
                  {previewScore()}
                </span>
                <span className={`badge badge-${previewGrade()}`}>{previewGrade()}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Comments</label>
            <textarea
              name="supervisor_comments"
              className="form-control"
              rows={3}
              placeholder="Optional feedback for the student…"
              value={form.supervisor_comments}
              onChange={handleChange}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}