import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api-token-auth/', {
                username,
                password
            });

            const token = response.data.token;
            localStorage.setItem('token', token);
            setToken(token);

            navigate('/');
        } catch (error) {
            alert("Invalid Credentials. Please check your username and password.");
        } finally {
            setLoading(false);    
        } 
    };

    // Professional UI Styles
    const pageStyle = {
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5'
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
            <div style={cardStyle}>
                <h2 style={{ color: '#2c3e50', marginBottom: '10px', fontWeight: '700' }}>Welcome Back</h2>
                <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Log in to the ILES Portal</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#34495e', textTransform: 'uppercase' }}>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
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