import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username: username,
                password: password 
            });

            if (response.data.access) {
                const token = response.data.access;
                const userRole = response.data.role || 'student';

                localStorage.setItem('token', token);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('userRole', userRole);
                
                setToken(token);

                if (userRole === 'admin') {
                    navigate('/admin-dashboard');
                } else if (userRole === 'supervisor' || userRole === 'academic_supervisor' || userRole === 'acad_supervisor') {
                    navigate('/academic-supervisor-dashboard');
                } else {
                    navigate('/student-dashboard');
                }
            } else {
                setError("Invalid server authentication response format.");
            }

        } catch (error) {
            const message = error.response?.data?.detail || error.response?.data?.error || "Invalid Credentials. Please check your username and password.";
            setError(message);
        } finally {
            setLoading(false);    
        } 
    };

    const pageStyle = {
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        gap: '15px'
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center'
    };

    const inputStyle = {
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        outline: 'none',
        width: '100%', 
        boxSizing: 'border-box',
        transition: 'border-color 0.3s'
    };

    const buttonStyle = {
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

    return (
        <div style={pageStyle}>
            <Link 
                to="/" 
                style={{ 
                    width: '100%', 
                    maxWidth: '400px', 
                    textAlign: 'left', 
                    color: '#7f8c8d', 
                    textDecoration: 'none', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    paddingLeft: '5px'
                }}
            >
                &larr; Back to Home
            </Link>

            <div style={cardStyle}>
                <h2 style={{ color: '#2c3e50', marginBottom: '10px', fontWeight: '700' }}>Welcome Back</h2>
                <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Log in to the ILES Portal</p>
                
                {error && (
                    <div style={{ backgroundColor: '#fdecea', color: '#c0392b', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#34495e', textTransform: 'uppercase' }}>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#34495e', textTransform: 'uppercase' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            style={inputStyle}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={buttonStyle}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', fontSize: '14px', color: '#7f8c8d' }}>
                    <Link to="/forgot-password" style={{ color: '#3498db', textDecoration: 'none' }}>Forgot Password?</Link>
                    <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
                    <p>Don't have an account? <Link to="/signup" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '600' }}>Create one</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;