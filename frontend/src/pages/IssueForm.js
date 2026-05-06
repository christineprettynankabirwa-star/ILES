import React, { useState } from 'react';
import axios from 'axios';

function IssueForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // This starts the Full Request Flow
        axios.post("http://127.0.0.1:8000/api/issues/", {
            title: title,
            description: description,
            issue_type: "Missing Marks"
        })
        .then(response => {
            alert("Issue submitted successfully!");
            setTitle(""); // Clear the Form
            setDescription("");
        })
        .catch(error => console.error("Error submitting issue:", error));
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px'}}>
            <h3>Report an Issue</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                /><br /><br />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                /><br /><br />
                <button type="submit">Submit Issue</button>
            </form>
        </div>
    );
}

export default IssueForm;