import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://127.0.0.1:8000/api/forgot-password/', { email });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const pageStyle = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        gap: '15px',
        padding: '20px'
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s'
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: loading ? '#bdc3c7' : '#2c3e50',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '10px',
        transition: 'background-color 0.3s'
    };

    const errorStyle = {
        backgroundColor: '#fdecea',
        color: '#c0392b',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '14px',
        textAlign: 'center',
        border: '1px solid #f5c6cb',
        marginBottom: '15px'
    };

    const successStyle = {
        backgroundColor: '#eafaf1',
        color: '#1e8449',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '15px',
        textAlign: 'center',
        border: '1px solid #a9dfbf',
        lineHeight: '1.6'
    };

    return (
        <div style={pageStyle}>
            <Link
                to="/login"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    textAlign: 'left',
                    color: '#7f8c8d',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    paddingLeft: '5px'
                }}
            >
                &larr; Back to Login
            </Link>

            <div style={cardStyle}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔑</div>
                <h2 style={{ color: '#2c3e50', marginBottom: '10px', fontWeight: '700' }}>Forgot Password?</h2>
                <p style={{ color: '#7f8c8d', marginBottom: '25px', fontSize: '14px', lineHeight: '1.6' }}>
                    Enter your registered email address and we'll send you a link to reset your password.
                </p>

                {error && <div style={errorStyle}>{error}</div>}

                {submitted ? (
                    <div style={successStyle}>
                        ✅ A password reset link has been sent to <strong>{email}</strong>. 
                        Please check your inbox and follow the instructions.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#34495e', textTransform: 'uppercase' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = '#3498db'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={buttonStyle}
                            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#34495e')}
                            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#2c3e50')}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '25px', fontSize: '14px', color: '#7f8c8d' }}>
                    <p>
                        Remembered your password?{' '}
                        <Link to="/login" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '600' }}>
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;