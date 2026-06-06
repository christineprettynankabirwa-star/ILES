import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // New: Loading state
    const [error, setError] = useState(''); // New: Error state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError(''); // Clear previous errors

        try {
            const response = await axios.post('http://127.0.0.1:8000/api-token-auth/', {
                username: username,
                password: password 
            });

            console.log("Login response:", response.data);

            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                console.log("Saved access_token");
            } else if (response.data.token) {
                localStorage.setItem('access_token', response.data.token);
                console.log("Saved token as access_token");
            } else {
                console.log("Unknown response format:", response.data);
            }

            alert("Login Successful!");
            navigate('/dashboard');

        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid Credentials. Please try again.");
        } finally {
            setLoading(false);    
        } 
    };

    return (
        <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
            <h2>🎓 ILES Login</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required/>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
                {error && <p style={{ color: 'red', margin: '0' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;