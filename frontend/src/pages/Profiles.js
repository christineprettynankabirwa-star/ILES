import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/UI';

const ROLE_LABELS = {
  student: 'Student Intern',
  work_supervisor: 'Workplace Supervisor',
  acad_supervisor: 'Academic Supervisor',
  admin: 'Administrator',
};

const ROLE_COLORS = {
  student: { bg: 'var(--primary-light)', color: 'var(--primary-dark)' },
  work_supervisor: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  acad_supervisor: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  admin: { bg: 'var(--danger-light)', color: 'var(--danger)' },
};

// ESLINT-DISABLE-NEXT-LINE
export default function Profile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/user/profile/'),
      api.get('/departments/'),
    ]).then(([pRes, dRes]) => {
      setProfile(pRes.data);
      setDepartments(dRes.data);
      setForm({
        first_name: pRes.data.first_name || '',
        last_name: pRes.data.last_name || '',
        email: pRes.data.email || '',
        phone_number: pRes.data.phone_number || '',
        department: pRes.data.department || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    setSuccess('');
    try {
      const payload = { ...form };
      if (!payload.department) delete payload.department;
      const res = await api.patch('/user/profile/', payload);
      setProfile(res.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (!profile) return <div className="alert alert-error">Could not load profile.</div>;

  const initials = `${(profile.first_name || profile.username)[0]}${(profile.last_name || '')[0] || ''}`.toUpperCase();
  const rc = ROLE_COLORS[profile.role] || {};
  const fullName = profile.first_name || profile.last_name
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : profile.username;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {success && <div className="alert alert-success" style={{ marginBottom: 20 }}>{success}</div>}

      {/* Profile header card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: rc.bg || 'var(--primary-light)',
            color: rc.color || 'var(--primary-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 28, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{fullName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', padding: '3px 10px',
                borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: rc.bg, color: rc.color,
              }}>
                {ROLE_LABELS[profile.role] || profile.role}
              </span>
              {profile.department_name && (
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  · {profile.department_name}
                </span>
              )}
            </div>
            {profile.email && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                {profile.email}
              </div>
            )}
          </div>
          {!editing && (
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          )}
        </div>
      </div>

      {/* Details Card */}
      {!editing ? (
        <div className="card">
          <div className="card-title">Account details</div>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { label: 'Username', value: profile.username },
              { label: 'Full name', value: fullName },
              { label: 'Email', value: profile.email || '—' },
              { label: 'Phone number', value: profile.phone_number || '—' },
              { label: 'Department', value: profile.department_name || '—' },
              ...(profile.role === 'student' ? [{ label: 'Student number', value: profile.student_number || '—' }] : []),
              ...(profile.role !== 'student' ? [{ label: 'Staff number', value: profile.staff_number || '—' }] : []),
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{row.label}</span>
                <span style={{ fontSize: 14, color: 'var(--text)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-title">Edit profile</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name</label>
              <input name="first_name" className="form-control" value={form.first_name} onChange={handleChange} />
              {errors.first_name && <div className="form-error">{errors.first_name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input name="last_name" className="form-control" value={form.last_name} onChange={handleChange} />
              {errors.last_name && <div className="form-error">{errors.last_name}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input name="phone_number" className="form-control" value={form.phone_number} onChange={handleChange} />
            {errors.phone_number && <div className="form-error">{errors.phone_number}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select name="department" className="form-control" value={form.department} onChange={handleChange}>
              <option value="">— Select —</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={() => { setEditing(false); setErrors({}); }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {/* Read-only info card */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title">System information</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            { label: 'User ID', value: `#${profile.id}` },
            { label: 'Role', value: ROLE_LABELS[profile.role] || profile.role },
            ...(profile.student_number ? [{ label: 'Student number', value: profile.student_number }] : []),
            ...(profile.staff_number ? [{ label: 'Staff number', value: profile.staff_number }] : []),
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row.label}</span>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-hint)', marginTop: 14 }}>
          Role and system identifiers cannot be changed from this page. Contact an administrator for role changes.
        </p>
      </div>
    </div>
  );
}
