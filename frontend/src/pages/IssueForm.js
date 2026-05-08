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

        // This starts the Full Request Flow
        try {
            // Include the Authorization header to fix the 401 Unauthorized error
            await axios.post("http://127.0.0.1:8000/api/issues/", 
            {
                title: title,
                description: description,
                issue_type: "Missing Marks" // Keeping your default type
            }, 
            {
                headers: {
                    'Authorization': `Token ${token}` 
                }
            });

            alert("Issue submitted successfully!");
            
            // Clear the form fields after success
            setTitle(""); 
            setDescription("");
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit issue. Please ensure you are logged in.");
        } finally {
            setLoading(false); // Re-enable the button
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px', borderRadius: '8px' }}>
            <h3>Report an Issue</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    style={{ height: '80px' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Issue"}
                </button>
            </form>
        </div>
    );
}

export default IssueForm;