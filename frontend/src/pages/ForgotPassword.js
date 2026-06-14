import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/forgot-password/', { email });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">I</div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>ILES Portal</span>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h1 style={{ marginBottom: 8 }}>Check your email</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', padding: 11 }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1>Forgot password?</h1>
            <p className="subtitle">Enter your email and we'll send a reset link</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--text-muted)' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
