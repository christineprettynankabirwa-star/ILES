import { useState, useEffect } from 'react';

function StudentDashbord() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placement, setPlacement] = useState(null);
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({
        week_number: '',
        description: '',
        hours_worked: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.log("No token found");
            setLoading(false);
            return;
        }

        try {
            // Decode token to get user info 
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            console.log("User:", decoded);
            setUser(decoded);

            // Fetch student data
            fetchPlacement(token);
            fetchLogs(token);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPlacement = async (token) => {
        try {
            const res = await fetch('http://localhost:8000/api/student/placement/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPlacement(data);
            } 
        } catch (err) {
            console.error("Placement error:", err);
        }
    };

    const fetchLogs = async (token) => {
        try {
            const res = await fetch('http://localhost:8000/api/student/logs/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            console.error("Logs error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        const token = localStorage.getItem('access_token');

        try {
            const res = await fetch('http://localhost:8000/api/student/logs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMessage('✅ Log submitted successfully!');
                setFormData({ week_number: '', description: '', hours_worked: '' });
                fetchLogs(token); // Refresh list of logs
            } else {
                const errorData = await res.json();
                setMessage(`❌ Error: ${errorData.detail || 'Failed to submit log.'}`);
            }
        } catch (err) {
            setMessage(`❌ Network error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };
}