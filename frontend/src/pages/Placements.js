import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Spinner, Badge, EmptyState, Modal } from '../components/UI';

const emptyForm = {
  student: '', academic_supervisor: '', workplace_supervisor: '',
  organization_name: '', registration_number: '', position: '',
  location: '', duration: '', stipend: '', description: '', course: '',
  start_date: '', end_date: '', is_active: false, // default inactive — admin approves
};

export default function Placements() {
  const { user } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [users, setUsers] = useState({ students: [], acad: [], work: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isAdmin    = user?.role === 'admin';
  const isStudent  = user?.role === 'student';
  const isWorkSup  = user?.role === 'work_supervisor';
  const isAcadSup  = user?.role === 'acad_supervisor';

  // Supervisors can VIEW only — no create/edit/delete
  const canCreate  = isAdmin || isStudent;
  const canEdit    = isAdmin; // only admin edits (including approve/assign)
  const canDelete  = isAdmin;

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const fetchUsers = (isAdmin || isWorkSup || isAcadSup)
        ? api.get('/users/')
        : Promise.resolve({ data: [] });

      const [pRes, uRes] = await Promise.all([
        api.get('/placements/'),
        fetchUsers,
      ]);

      setPlacements(pRes.data);

      if (isAdmin || isWorkSup || isAcadSup) {
        const all = uRes.data;
        setUsers({
          students: all.filter(u => u.role === 'student'),
          acad:     all.filter(u => u.role === 'acad_supervisor'),
          work:     all.filter(u => u.role === 'work_supervisor'),
        });
      }
    } catch (err) {
      console.error('Placements load error:', err.response?.status, err.response?.data);
      const status = err.response?.status;
      if (status === 401) setLoadError('Session expired — please log in again.');
      else if (status === 403) setLoadError('You do not have permission to view placements.');
      else setLoadError('Failed to load placements. Check your connection and try again.');
    }
    setLoading(false);
  }, [isAdmin, isWorkSup, isAcadSup]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create'); };

  const openEdit = p => {
    setSelected(p);
    setForm({
      student:              p.student || '',
      academic_supervisor:  p.academic_supervisor || '',
      workplace_supervisor: p.workplace_supervisor || '',
      organization_name:    p.organization_name || '',
      registration_number:  p.registration_number || '',
      position:             p.position || '',
      location:             p.location || '',
      duration:             p.duration || '',
      stipend:              p.stipend || '',
      description:          p.description || '',
      course:               p.course || '',
      start_date:           p.start_date || '',
      end_date:             p.end_date || '',
      is_active:            p.is_active,
    });
    setErrors({});
    setModal('edit');
  };

  const openView = p => { setSelected(p); setModal('view'); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      const payload = { ...form };
      if (!payload.stipend) delete payload.stipend;
      if (!payload.description) delete payload.description;
      if (!payload.academic_supervisor) delete payload.academic_supervisor;
      if (!payload.workplace_supervisor) delete payload.workplace_supervisor;
      if (!payload.student) delete payload.student;

      // Students always create inactive — admin approves later
      if (isStudent) payload.is_active = false;

      if (modal === 'create') {
        await api.post('/placements/', payload);
      } else {
        await api.patch(`/placements/${selected.id}/`, payload);
      }
      setModal(null);
      load();
    } catch (err) {
      if (err.response?.data) {
        const d = err.response.data;
        if (typeof d === 'string') setErrors({ general: d });
        else if (Array.isArray(d)) setErrors({ general: d.join(' ') });
        else setErrors(d);
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  // Admin-only: toggle approval status
  const handleApprove = async p => {
    try {
      await api.patch(`/placements/${p.id}/`, { is_active: !p.is_active });
      load();
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not update placement status.');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this placement?')) return;
    try {
      await api.delete(`/placements/${id}/`);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not delete placement.');
    }
  };

  if (loading) return <Spinner />;

  if (loadError) {
    return (
      <div>
        <div className="page-header"><div><h1>Internship placements</h1></div></div>
        <div className="alert alert-error">
          {loadError}{' '}
          <button className="btn btn-secondary btn-sm" onClick={load} style={{ marginLeft: 12 }}>Retry</button>
        </div>
      </div>
    );
  }

  const emptyDescription = () => {
    if (isStudent) return 'Register your internship placement to get started. It will be reviewed and approved by the administrator.';
    if (isWorkSup) return 'No students have been assigned to you as workplace supervisor yet.';
    if (isAcadSup) return 'No students have been assigned to you as academic supervisor yet.';
    return 'No internship placements found.';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Internship placements</h1>
          <p>
            {isStudent  ? 'Your registered internship placement(s)' :
             isWorkSup  ? 'Students under your workplace supervision' :
             isAcadSup  ? 'Students under your academic supervision' :
             'Manage and approve student internship placements'}
          </p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={openCreate}>+ New placement</button>
        )}
      </div>

      {/* Admin notices */}
      {isAdmin && users.work.length === 0 && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          <strong>No workplace supervisors found.</strong> Register at least one <em>work_supervisor</em> user before assigning placements.
        </div>
      )}
      {isAdmin && users.acad.length === 0 && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          <strong>No academic supervisors found.</strong> Register at least one <em>acad_supervisor</em> user before assigning placements.
        </div>
      )}

      {/* Supervisor read-only notice */}
      {(isWorkSup || isAcadSup) && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          You can view placements assigned to you. Contact the administrator to make any changes.
        </div>
      )}

      {/* Student pending notice */}
      {isStudent && placements.some(p => !p.is_active) && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          Your placement is pending administrator approval.
        </div>
      )}

      {placements.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🏢"
            title="No placements yet"
            description={emptyDescription()}
            action={canCreate && <button className="btn btn-primary" onClick={openCreate}>{isStudent ? 'Register placement' : 'Add placement'}</button>}
          />
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Organisation</th>
                  <th>Position</th>
                  {(isAdmin || isAcadSup) && <th>Academic supervisor</th>}
                  {(isAdmin || isWorkSup) && <th>Workplace supervisor</th>}
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {placements.map(p => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.student_name || '—'}</strong>
                      <div className="text-muted" style={{ fontSize: 12 }}>{p.course}</div>
                    </td>
                    <td>
                      {p.organization_name}
                      <div className="text-muted" style={{ fontSize: 12 }}>{p.location}</div>
                    </td>
                    <td>{p.position}</td>
                    {(isAdmin || isAcadSup) && (
                      <td style={{ fontSize: 13 }}>{p.academic_supervisor_name || <span className="text-muted">—</span>}</td>
                    )}
                    {(isAdmin || isWorkSup) && (
                      <td style={{ fontSize: 13 }}>{p.workplace_supervisor_name || <span className="text-muted">—</span>}</td>
                    )}
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.start_date} → {p.end_date}</td>
                    <td><Badge status={p.is_active ? 'active' : 'inactive'} /></td>
                    <td>
                      {p.final_grade
                        ? <span className={`badge badge-${p.final_grade}`}>{p.final_grade} ({parseFloat(p.total_score).toFixed(1)})</span>
                        : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openView(p)}>View</button>
                        {canEdit && (
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        )}
                        {/* Student can edit their own inactive placement */}
                        {isStudent && !p.is_active && (
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        )}
                        {/* Admin approve/reject toggle */}
                        {isAdmin && (
                          <button
                            className={`btn btn-sm ${p.is_active ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => handleApprove(p)}
                          >
                            {p.is_active ? 'Revoke' : 'Approve'}
                          </button>
                        )}
                        {canDelete && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
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
        <Modal title="Placement details" onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gap: 14 }}>
            <Detail label="Student" value={selected.student_name} />
            <Detail label="Organisation" value={selected.organization_name} />
            <Detail label="Position" value={selected.position} />
            <Detail label="Location" value={selected.location} />
            <Detail label="Course" value={selected.course} />
            <Detail label="Duration" value={selected.duration} />
            <Detail label="Dates" value={`${selected.start_date} to ${selected.end_date}`} />
            <Detail label="Academic supervisor" value={selected.academic_supervisor_name || '—'} />
            <Detail label="Workplace supervisor" value={selected.workplace_supervisor_name || '—'} />
            <Detail label="Stipend" value={selected.stipend || '—'} />
            {selected.description && <Detail label="Description" value={selected.description} />}
            <Detail label="Status" value={<Badge status={selected.is_active ? 'active' : 'inactive'} />} />
            {!selected.is_active && (
              <div className="alert alert-info" style={{ margin: 0 }}>Awaiting administrator approval.</div>
            )}
            <Detail label="Grade" value={selected.final_grade
              ? <span className={`badge badge-${selected.final_grade}`}>{selected.final_grade} ({parseFloat(selected.total_score).toFixed(1)})</span>
              : '—'} />
          </div>
        </Modal>
      )}

      {/* Create / Edit Modal — only admin and student */}
      {(modal === 'create' || modal === 'edit') && (canCreate || canEdit) && (
        <Modal
          title={modal === 'create' ? 'New placement' : 'Edit placement'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save placement'}
              </button>
            </>
          }
        >
          {errors.general && <div className="alert alert-error">{errors.general}</div>}
          {errors.non_field_errors && <div className="alert alert-error">{errors.non_field_errors}</div>}

          {isStudent && (
            <div className="alert alert-info" style={{ marginBottom: 16 }}>
              Your placement will be submitted for administrator approval.
            </div>
          )}

          {/* Admin-only: assign student and supervisors */}
          {isAdmin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student <span className="req">*</span></label>
                  <select name="student" className="form-control" value={form.student} onChange={handleChange}>
                    <option value="">— Select —</option>
                    {users.students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.first_name && s.last_name ? `${s.first_name} ${s.last_name}` : s.username}
                        {s.student_number ? ` (${s.student_number})` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.student && <div className="form-error">{errors.student}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Academic supervisor</label>
                  <select name="academic_supervisor" className="form-control" value={form.academic_supervisor} onChange={handleChange}>
                    <option value="">— Select —</option>
                    {users.acad.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.first_name && s.last_name ? `${s.first_name} ${s.last_name}` : s.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Workplace supervisor</label>
                <select name="workplace_supervisor" className="form-control" value={form.workplace_supervisor} onChange={handleChange}>
                  <option value="">— Select —</option>
                  {users.work.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.first_name && s.last_name ? `${s.first_name} ${s.last_name}` : s.username}
                    </option>
                  ))}
                </select>
              </div>
              {/* Admin approval toggle */}
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="is_active" name="is_active" checked={form.is_active} onChange={handleChange} />
                <label htmlFor="is_active" style={{ margin: 0, fontSize: 14 }}>
                  Approve placement (mark as active)
                </label>
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organisation name <span className="req">*</span></label>
              <input name="organization_name" className="form-control" value={form.organization_name} onChange={handleChange} />
              {errors.organization_name && <div className="form-error">{errors.organization_name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Reg. number</label>
              <input name="registration_number" className="form-control" value={form.registration_number} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Position <span className="req">*</span></label>
              <input name="position" className="form-control" value={form.position} onChange={handleChange} />
              {errors.position && <div className="form-error">{errors.position}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Location <span className="req">*</span></label>
              <input name="location" className="form-control" value={form.location} onChange={handleChange} />
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Course <span className="req">*</span></label>
              <input name="course" className="form-control" value={form.course} onChange={handleChange} />
              {errors.course && <div className="form-error">{errors.course}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Duration <span className="req">*</span></label>
              <input name="duration" className="form-control" placeholder="e.g. 3 months" value={form.duration} onChange={handleChange} />
              {errors.duration && <div className="form-error">{errors.duration}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start date <span className="req">*</span></label>
              <input type="date" name="start_date" className="form-control" value={form.start_date} onChange={handleChange} />
              {errors.start_date && <div className="form-error">{errors.start_date}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">End date <span className="req">*</span></label>
              <input type="date" name="end_date" className="form-control" value={form.end_date} onChange={handleChange} />
              {errors.end_date && <div className="form-error">{errors.end_date}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Stipend</label>
            <input name="stipend" className="form-control" placeholder="e.g. UGX 300,000/month" value={form.stipend} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleChange} />
          </div>
        </Modal>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', minWidth: 150, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13.5 }}>{value}</span>
    </div>
  );
}