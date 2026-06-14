import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Spinner, EmptyState, Modal } from '../components/UI';

const ROLE_LABELS = {
  student: 'Student',
  work_supervisor: 'Workplace Supervisor',
  acad_supervisor: 'Academic Supervisor',
  admin: 'Admin',
};

const ROLE_COLORS = {
  student: { bg: 'var(--primary-light)', color: 'var(--primary-dark)' },
  work_supervisor: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  acad_supervisor: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  admin: { bg: 'var(--danger-light)', color: 'var(--danger)' },
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, dRes] = await Promise.all([
        api.get('/users/'),
        api.get('/departments/'),
      ]);
      setUsers(uRes.data);
      setDepartments(dRes.data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openView = u => { setSelected(u); setModal('view'); };

  const filtered = users.filter(u => {
    const matchRole = filterRole ? u.role === filterRole : true;
    const matchSearch = search
      ? u.username.toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.last_name || '').toLowerCase().includes(search.toLowerCase())
      : true;
    return matchRole && matchSearch;
  });

  const getDeptName = id => {
    const d = departments.find(d => d.id === id);
    return d ? d.name : '—';
  };

  const initials = u =>
    `${(u.first_name || u.username)[0]}${(u.last_name || '')[0] || ''}`.toUpperCase();

  // Stats
  const roleCounts = Object.keys(ROLE_LABELS).reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {});

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>User management</h1>
          <p>View and manage all registered system users</p>
        </div>
      </div>

      {/* Role summary cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <div
            key={role}
            className="stat-card"
            style={{
              borderTop: `3px solid ${ROLE_COLORS[role].color}`,
              cursor: 'pointer',
            }}
            onClick={() => setFilterRole(filterRole === role ? '' : role)}
          >
            <div className="label">{label}s</div>
            <div className="value">{roleCounts[role]}</div>
            <div className="sub">{filterRole === role ? '← click to clear' : 'click to filter'}</div>
          </div>
        ))}
        <div className="stat-card accent-blue">
          <div className="label">Total users</div>
          <div className="value">{users.length}</div>
          <div className="sub">All roles</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          className="search-input"
          placeholder="Search by name, username or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
        >
          <option value="">All roles</option>
          {Object.entries(ROLE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <span className="text-muted">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon="👤" title="No users found" description="Try adjusting your search or filter." />
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Student / Staff #</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const rc = ROLE_COLORS[u.role] || {};
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: rc.bg || 'var(--primary-light)',
                            color: rc.color || 'var(--primary-dark)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 13, flexShrink: 0,
                          }}>
                            {initials(u)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {u.first_name || u.last_name
                                ? `${u.first_name} ${u.last_name}`.trim()
                                : u.username}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              @{u.username} {u.email ? `· ${u.email}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          padding: '3px 9px',
                          borderRadius: 20,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: rc.bg,
                          color: rc.color,
                        }}>
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: 13 }}>{u.department_name || getDeptName(u.department) || '—'}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {u.student_number || u.staff_number || '—'}
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.phone_number || '—'}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => openView(u)}>
                          View
                        </button>
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
        <Modal title="User details" onClose={() => setModal(null)}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: ROLE_COLORS[selected.role]?.bg || 'var(--primary-light)',
              color: ROLE_COLORS[selected.role]?.color || 'var(--primary-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 24, margin: '0 auto 12px',
            }}>
              {initials(selected)}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {selected.first_name || selected.last_name
                ? `${selected.first_name} ${selected.last_name}`.trim()
                : selected.username}
            </h3>
            <span style={{
              display: 'inline-flex', padding: '4px 12px', borderRadius: 20,
              fontSize: 12, fontWeight: 600,
              background: ROLE_COLORS[selected.role]?.bg,
              color: ROLE_COLORS[selected.role]?.color,
            }}>
              {ROLE_LABELS[selected.role] || selected.role}
            </span>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { label: 'Username', value: selected.username },
              { label: 'Email', value: selected.email || '—' },
              { label: 'Department', value: selected.department_name || getDeptName(selected.department) || '—' },
              { label: 'Student number', value: selected.student_number || '—' },
              { label: 'Staff number', value: selected.staff_number || '—' },
              { label: 'Phone', value: selected.phone_number || '—' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', minWidth: 140 }}>{row.label}</span>
                <span style={{ fontSize: 13.5 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}