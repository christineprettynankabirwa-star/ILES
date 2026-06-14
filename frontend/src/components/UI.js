import React from 'react';

export function Spinner() {
  return <div className="loading-center"><div className="spinner" /></div>;
}

export function Badge({ status }) {
  const map = {
    draft: 'badge-draft', submitted: 'badge-submitted',
    reviewed: 'badge-reviewed', approved: 'badge-approved',
    active: 'badge-active', inactive: 'badge-inactive',
    A: 'badge-A', B: 'badge-B', C: 'badge-C', D: 'badge-D', F: 'badge-F',
    true: 'badge-active', false: 'badge-inactive',
  };
  const key = String(status);
  return <span className={`badge ${map[key] || 'badge-draft'}`}>{key}</span>;
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: 40, marginBottom: 10 }}>{icon || '📭'}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function Alert({ type = 'info', children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

export function FormGroup({ label, required, error, children }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}{required && <span className="req"> *</span>}
        </label>
      )}
      {children}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export function ConfirmModal({ title, message, onConfirm, onClose, danger }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </>
      }
    >
      <p style={{ color: 'var(--text-muted)' }}>{message}</p>
    </Modal>
  );
}
