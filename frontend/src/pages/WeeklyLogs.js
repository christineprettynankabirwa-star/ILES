import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Spinner, Badge, EmptyState, Modal } from '../components/UI';

const emptyForm = {
  placement: '',
  week_number: '',
  week_start_date: '',
  activities: '',
  challenges: '',
  status: 'draft',
};

export default function WeeklyLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const role = user?.role;
  const isStudent = role === 'student';
  const isWorkSup = role === 'work_supervisor';
  const isAcadSup = role === 'acad_supervisor';
  const isAdmin = role === 'admin';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [logsRes, placRes] = await Promise.all([
        api.get('/weekly-logs/'),
        api.get('/placements/'),
      ]);
      setLogs(logsRes.data);
      setPlacements(placRes.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm(emptyForm);
    setErrors({});
    setModal('create');
  };

  const openEdit = log => {
    setSelected(log);
    setForm({
      placement: log.placement,
      week_number: log.week_number,
      week_start_date: log.week_start_date || '',
      activities: log.activities,
      challenges: log.challenges,
      status: log.status,
    });
    setErrors({});
    setModal('edit');
  };

  const openView = log => {
    setSelected(log);
    setModal('view');
  };

  const openReview = log => {
    setSelected(log);
    setReviewComment('');
    setModal('review');
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      if (modal === 'create') {
        await api.post('/weekly-logs/', form);
      } else {
        await api.patch(`/weekly-logs/${selected.id}/`, form);
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

  const handleSubmitLog = async (log) => {
    try {
      await api.patch(`/weekly-logs/${log.id}/`, { status: 'submitted' });
      load();
    } catch (err) {
      alert(err.response?.data?.status || err.response?.data?.detail || 'Could not submit log.');
    }
  };

  const handleReview = async () => {
    setSaving(true);
    try {
      await api.patch(`/weekly-logs/${selected.id}/review/`, {
        supervisor_comments: reviewComment,
      });
      setModal(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Could not review log.');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (log) => {
    try {
      await api.patch(`/weekly-logs/${log.id}/approve/`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Could not approve log.');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this log?')) return;
    await api.delete(`/weekly-logs/${id}/`);
    load();
  };

  const filtered = filterStatus
    ? logs.filter(l => l.status === filterStatus)
    : logs;

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Weekly logbook</h1>
          <p>
            {isStudent ? 'Submit and track your weekly activity logs' :
             isWorkSup ? 'Review submitted logs from your students' :
             isAcadSup ? 'Approve reviewed logs and manage evaluations' :
             'All student weekly logs'}
          </p>
        </div>
        {isStudent && (
          <button className="btn btn-primary" onClick={openCreate}>
            + New log
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters">
        <select
          className="filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
        </select>
        <span className="text-muted">{filtered.length} log{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📝"
            title="No logs found"
            description={isStudent ? 'Start by creating your first weekly log.' : 'No logs match the current filter.'}
            action={isStudent && <button className="btn btn-primary" onClick={openCreate}>Create log</button>}
          />
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {!isStudent && <th>Student</th>}
                  <th>Week</th>
                  <th>Week start</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Reviewed by</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id}>
                    {!isStudent && (
                      <td><strong>{log.student_name}</strong></td>
                    )}
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--primary-light)', color: 'var(--primary-dark)',
                        fontWeight: 700, fontSize: 13,
                      }}>
                        {log.week_number}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {log.week_start_date || '—'}
                    </td>
                    <td><Badge status={log.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {log.submitted_at ? new Date(log.submitted_at).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ fontSize: 13 }}>{log.reviewed_by || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openView(log)}>
                          View
                        </button>
                        {isStudent && log.status === 'draft' && (
                          <>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(log)}>
                              Edit
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleSubmitLog(log)}>
                              Submit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(log.id)}>
                              Delete
                            </button>
                          </>
                        )}
                        {isWorkSup && log.status === 'submitted' && (
                          <button className="btn btn-success btn-sm" onClick={() => openReview(log)}>
                            Review
                          </button>
                        )}
                        {isAcadSup && log.status === 'reviewed' && (
                          <button className="btn btn-success btn-sm" onClick={() => handleApprove(log)}>
                            Approve
                          </button>
                        )}
                        {isAdmin && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(log.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <Modal
          title={`Week ${selected.week_number} Log`}
          onClose={() => setModal(null)}
          footer={
            <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge status={selected.status} />
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Close</button>
            </div>
          }
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                Activities
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)', margin: 0 }}>
                {selected.activities}
              </p>
            </div>
            <div className="divider" style={{ margin: '4px 0' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                Challenges
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)', margin: 0 }}>
                {selected.challenges}
              </p>
            </div>
            {selected.supervisor_comments && (
              <>
                <div className="divider" style={{ margin: '4px 0' }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    Supervisor comments
                  </div>
                  <div style={{
                    background: 'var(--warning-light)', borderRadius: 8,
                    padding: '12px 14px', fontSize: 14, lineHeight: 1.7,
                    color: 'var(--warning)', border: '1px solid rgba(185,117,23,0.2)',
                  }}>
                    {selected.supervisor_comments}
                  </div>
                </div>
              </>
            )}
            {/* Status History */}
            {selected.history && selected.history.length > 0 && (
              <>
                <div className="divider" style={{ margin: '4px 0' }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                    Status history
                  </div>
                  <div className="timeline">
                    {selected.history.map((h, i) => (
                      <div key={i} className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-label">
                          <Badge status={h.old_status} /> → <Badge status={h.new_status} />
                        </div>
                        <div className="timeline-time">
                          {new Date(h.changed_at).toLocaleString()} · {h.changed_by_username || 'system'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'New weekly log' : `Edit Week ${selected?.week_number} Log`}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save log'}
              </button>
            </>
          }
        >
          {errors.general && <div className="alert alert-error">{errors.general}</div>}

          <div className="form-group">
            <label className="form-label">Placement <span className="req">*</span></label>
            <select name="placement" className="form-control" value={form.placement} onChange={handleChange}>
              <option value="">— Select placement —</option>
              {placements.map(p => (
                <option key={p.id} value={p.id}>
                  {p.organization_name} — {p.position}
                </option>
              ))}
            </select>
            {errors.placement && <div className="form-error">{errors.placement}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Week number <span className="req">*</span></label>
              <input
                type="number"
                name="week_number"
                className="form-control"
                min="1"
                max="52"
                value={form.week_number}
                onChange={handleChange}
              />
              {errors.week_number && <div className="form-error">{errors.week_number}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Week start date</label>
              <input
                type="date"
                name="week_start_date"
                className="form-control"
                value={form.week_start_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Activities <span className="req">*</span></label>
            <textarea
              name="activities"
              className="form-control"
              rows={5}
              placeholder="Describe what you did this week…"
              value={form.activities}
              onChange={handleChange}
            />
            {errors.activities && <div className="form-error">{errors.activities}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Challenges <span className="req">*</span></label>
            <textarea
              name="challenges"
              className="form-control"
              rows={3}
              placeholder="Describe any challenges you faced…"
              value={form.challenges}
              onChange={handleChange}
            />
            {errors.challenges && <div className="form-error">{errors.challenges}</div>}
          </div>
        </Modal>
      )}

      {/* Review Modal (Workplace Supervisor) */}
      {modal === 'review' && selected && (
        <Modal
          title={`Review — Week ${selected.week_number} Log`}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={handleReview} disabled={saving}>
                {saving ? 'Submitting…' : 'Mark as reviewed'}
              </button>
            </>
          }
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Activities</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{selected.activities}</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Challenges</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{selected.challenges}</p>
          </div>
          <div className="divider" />
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Supervisor comments</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Add your feedback for the student…"
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}