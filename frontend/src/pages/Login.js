import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // New: Loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const response = await axios.post('http://127.0.0.1:8000/api-token-auth/', {
                username,
                password
            });

            const token = response.data.token;
            localStorage.setItem('token', token);
            setToken(token);

            navigate('/');
            alert("Login Successful!");
        } catch (error) {
            alert("Invalid Credentials. Please try again.");
        } finally {
            setLoading(false);    
        } 
    };

    return (
        <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
            <h2>ILES Login</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required/>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;