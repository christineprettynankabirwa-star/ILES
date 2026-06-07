import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student' // Default matches Django model default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/signup/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                role: formData.role  // ✅ Now sends exactly what Django models expect
            });

            alert(`Account created! Please log in.`);
            navigate('/login');

        } catch (error) {
            const message = error.response?.data?.error || "Signup failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const pageStyle = {
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '20px'
    };
    const cardStyle = {
        width: '100%', maxWidth: '450px', padding: '40px',
        backgroundColor: '#ffffff', borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    };
    const inputStyle = {
        padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box'
    };
    const selectStyle = {
        ...inputStyle, backgroundColor: '#fff', cursor: 'pointer',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23ccc%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")',
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px'
    };
    const buttonStyle = {
        width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
        backgroundColor: loading ? '#bdc3c7' : '#2ecc71', color: 'white',
        fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '10px', fontSize: '16px'
    };
    const errorStyle = {
        backgroundColor: '#fdecea', color: '#c0392b', padding: '10px 14px',
        borderRadius: '8px', fontSize: '14px', textAlign: 'center',
        border: '1px solid #f5c6cb'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '5px', fontWeight: '700' }}>
                    Join ILES
                </h2>
                <p style={{ color: '#7f8c8d', textAlign: 'center', marginBottom: '25px', fontSize: '14px' }}>
                    University of Uganda • CS Department
                </p>

                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    <input name="username" type="text" placeholder="Username"
                        style={inputStyle} onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email Address"
                        style={inputStyle} onChange={handleChange} required />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#34495e', marginLeft: '2px' }}>
                            REGISTER AS:
                        </label>
                        <select name="role" value={formData.role} style={selectStyle} onChange={handleChange}>
                            <option value="student">Student</option>
                            
                            {/* ✅ Matches ('acad_supervisor', 'Academic Supervisor') */}
                            <option value="acad_supervisor">Academic Supervisor</option>
                            
                            {/* ✅ Matches ('work_supervisor', 'Workplace Supervisor') */}
                            <option value="work_supervisor">Workplace Supervisor</option>
                        </select>
                    </div>

                    <input name="password" type="password" placeholder="Password"
                        style={inputStyle} onChange={handleChange} required />
                    <input name="confirmPassword" type="password" placeholder="Confirm Password"
                        style={inputStyle} onChange={handleChange} required />

                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? 'Creating Account...' : 'Register Account'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#7f8c8d' }}>
                    <p>Already have an account?{' '}
                        <Link to="/login" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '600' }}>
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;