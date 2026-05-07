import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api-tokenauth/', {
                username,
                password
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            setToken(token);
            alert("Login Successful!");
        } catch (error) {
            alert("Invalid Credentials");
        } 
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;