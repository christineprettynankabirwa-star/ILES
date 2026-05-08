import React, { useState } from 'react';
import axios from 'axios';

function IssueForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            await axios.post("http://127.0.0.1:8000/api/issues/", 
            {
                title: title,
                description: description,
                issue_type: "Missing Marks" 
            }, 
            {
                headers: {
                    'Authorization': `Token ${token}` 
                }
            });

            alert("Issue submitted successfully!");
            setTitle(""); 
            setDescription("");
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit issue. Please ensure you are logged in.");
        } finally {
            setLoading(false);
        }
    };

    const formCardStyle = {
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        marginTop: '30px',
        borderTop: '5px solid #3498db'
    };

    const inputStyle = {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const buttonStyle = {
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: loading ? '#bdc3c7' : '#3498db',
        color: 'white',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.2s'
    };

    return (
        <div style={formCardStyle}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px', fontWeight: '600' }}>
                Report a New Issue
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Issue Title
                </label>
                <input
                    type="text"
                    placeholder="Enter a brief title (e.g., Missing Log Marks)"
                    style={inputStyle}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = '#3498db'}
                    onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
                    required
                />

                <label style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Detailed Description
                </label>
                <textarea
                    placeholder="Provide more details about the issue..."
                    style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = '#3498db'}
                    onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
                    required
                />

                <button 
                    type="submit" 
                    disabled={loading} 
                    style={buttonStyle}
                    onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#2980b9')}
                    onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#3498db')}
                >
                    {loading ? "Processing..." : "Submit Issue Report"}
                </button>
            </form>
        </div>
    );
}

export default IssueForm;