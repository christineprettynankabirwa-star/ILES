import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Spinner, EmptyState, Modal } from '../components/UI';

const emptyForm = { title: '', description: '', max_score: '' };

export default function Criteria() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/criteria/');
      setCriteria(res.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create'); };
  const openEdit = c => { setSelected(c); setForm({ title: c.title, description: c.description || '', max_score: c.max_score }); setErrors({}); setModal('edit'); };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/criteria/', form);
      } else {
        await api.patch(`/criteria/${selected.id}/`, form);
      }
      setModal(null);
      load();
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this criterion?')) return;
    await api.delete(`/criteria/${id}/`);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Evaluation criteria</h1>
          <p>Configure the scoring criteria used in student evaluations</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + New criterion
        </button>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <strong>Note:</strong> The system currently uses three fixed criteria — Attendance & Punctuality (40%), Technical Competence (30%), and Quality of Work (30%). Use this page to document additional reference criteria.
      </div>

      {criteria.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📋"
            title="No criteria defined"
            description="Add evaluation criteria to reference during assessments."
            action={<button className="btn btn-primary" onClick={openCreate}>Add criterion</button>}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {criteria.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{c.title}</h3>
                <span style={{
                  display: 'inline-flex', padding: '3px 10px',
                  background: 'var(--primary-light)', color: 'var(--primary-dark)',
                  borderRadius: 20, fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {c.max_score} marks
                </span>
              </div>
              {c.description && (
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>
                  {c.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)} style={{ flex: 1 }}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'New criterion' : 'Edit criterion'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Title <span className="req">*</span></label>
            <input name="title" className="form-control" value={form.title} onChange={handleChange} autoFocus />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Max score <span className="req">*</span></label>
            <input type="number" name="max_score" className="form-control" min="1" value={form.max_score} onChange={handleChange} />
            {errors.max_score && <div className="form-error">{errors.max_score}</div>}
          </div>
        </Modal>
      )}
    </div>
  );
}