import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

/**
 * App-wide toast + confirm dialog provider.
 * Replaces scattered alert()/window.confirm() calls so feedback
 * (e.g. "Could not delete department") looks consistent with the
 * rest of the UI (.alert-error / .alert-success styles).
 *
 * Usage:
 *   const { notify, confirm } = useToast();
 *   notify('error', 'Could not delete department — it may still have users assigned.');
 *   const ok = await confirm('Delete this department? This may affect assigned users.');
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const resolverRef = useRef(null);

  const dismiss = useCallback(id => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const notify = useCallback((type, message, timeout = 4000) => {
    const id = ++idCounter;
    setToasts(t => [...t, { id, type, message }]);
    if (timeout) setTimeout(() => dismiss(id), timeout);
  }, [dismiss]);

  const confirm = useCallback((message, opts = {}) => {
    return new Promise(resolve => {
      resolverRef.current = resolve;
      setConfirmState({
        message,
        title: opts.title || 'Are you sure?',
        confirmLabel: opts.confirmLabel || 'Confirm',
        cancelLabel: opts.cancelLabel || 'Cancel',
        danger: opts.danger !== false,
      });
    });
  }, []);

  const handleConfirmResult = useCallback(result => {
    setConfirmState(null);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  return (
    <ToastContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Toast stack */}
      <div className="toast-stack" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => dismiss(t.id)}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmState && (
        <div className="confirm-overlay" role="alertdialog" aria-modal="true">
          <div className="confirm-card">
            <div className="confirm-title">{confirmState.title}</div>
            <p className="confirm-message">{confirmState.message}</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => handleConfirmResult(false)}>
                {confirmState.cancelLabel}
              </button>
              <button
                className={confirmState.danger ? 'btn btn-danger' : 'btn btn-primary'}
                onClick={() => handleConfirmResult(true)}
                autoFocus
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}