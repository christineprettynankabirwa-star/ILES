import React, { useState, useEffect } from 'react';
import { Spinner, EmptyState, Modal } from '../components/UI';
import { useDepartments } from '../context/DepartmentsContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const emptyForm = { name: '', code: '' };

export default function Departments() {
  const { departments, loading, refresh, ensureLoaded } = useDepartments();
  const { notify, confirm } = useToast();

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create'); };
  const openEdit = d => { setSelected(d); setForm({ name: d.name, code: d.code }); setErrors({}); setModal('edit'); };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      if (modal === 'create') {
        await api.post('/departments/', form);
        notify('success', `Department "${form.name}" created.`);
      } else {
        await api.patch(`/departments/${selected.id}/`, form);
        notify('success', `Department "${form.name}" updated.`);
      }
      setModal(null);
      refresh();
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
      else notify('error', 'Something went wrong while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async d => {
    const ok = await confirm(
      `Delete "${d.name}" (${d.code})? This may affect assigned users.`,
      { title: 'Delete department', confirmLabel: 'Delete', danger: true }
    );
    if (!ok) return;
    try {
      await api.delete(`/departments/${d.id}/`);
      notify('success', `Department "${d.name}" deleted.`);
      refresh();
    } catch {
      notify('error', 'Could not delete department — it may still have users assigned.');
    }
  };

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && departments.length === 0) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>Manage university departments for user assignment</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + New department
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card accent-blue">
          <div className="label">Total departments</div>
          <div className="value">{departments.length}</div>
          <div className="sub">Registered</div>
        </div>
      </div>

      <div className="filters">
        <input
          className="search-input"
          placeholder="Search departments…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="text-muted">{filtered.length} department{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🏫"
            title="No departments found"
            description="Add your first department to get started."
            action={<button className="btn btn-primary" onClick={openCreate}>Add department</button>}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(d => (
            <div key={d.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                  }}>🏫</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{d.name}</div>
                    <div style={{
                      display: 'inline-flex',
                      marginTop: 4,
                      padding: '2px 8px',
                      background: 'var(--gray-50)',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.5px',
                    }}>
                      {d.code}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)} style={{ flex: 1 }}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'New department' : 'Edit department'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save department'}
              </button>
            </>
          }
        >
          {errors.non_field_errors && <div className="alert alert-error">{errors.non_field_errors}</div>}

          <div className="form-group">
            <label className="form-label">Department name <span className="req">*</span></label>
            <input
              name="name"
              className="form-control"
              placeholder="e.g. Computer Science"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Department code <span className="req">*</span></label>
            <input
              name="code"
              className="form-control"
              placeholder="e.g. CS"
              value={form.code}
              onChange={handleChange}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.code && <div className="form-error">{errors.code}</div>}
          </div>
        </Modal>
      )}
    </div>
  );
}