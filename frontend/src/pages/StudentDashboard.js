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

    if (loading) return <div style={{padding: '20px'}}>Loading...</div>;

    if (!user) {
        return (
        <div style={{padding: '20px'}}>
            <h1>ILES INTERNSHIP SYSTEM</h1>
            <p>❌ Not logged in</p>
            <p>Please <a href="/login">login here</a></p>
        </div>
    );
}

    return (
        <div style={{padding: '20px'}}>
            <h1>🎓 ILES INTERNSHIP SYSTEM</h1>
            <p>Welcome, <strong>{user.username}</strong> (Role: {user.role})</p>

            {/* Placement Info */}
            <section style={{border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                <h2>📋 My  Internship Placement </h2>
                {placement ? (
                    <div>
                        <p><strong>Company:</strong> {placement.company_name}</p>
                        <p><strong>Period:</strong> {placement.start_date} to {placement.end_date}</p>
                        <p><strong>Supervisor:</strong> {placement.supervisor_name || 'Assigned'} ({placement.supervisor_email})</p>
                    </div>
                ) : (
                    <p>⚠️ No placement assigned yet. Contact your administrator.</p>
                )}
            </section>

            {/* Log Submission Form */}
            <section style={{border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                <h2>📝 Submit Weekly Log</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '10px'}}>
                        <label>Week Number: </label>
                        <input
                            type="number"
                            name="week_number"
                            value={formData.week_number}
                            onChange={(e) => setFormData({...formData, week_number: e.target.value})}
                            required
                            style={{marginLeft: '10px', padding: '5px'}}
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label>Description: </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                            rows="3"
                            style={{marginLeft: '10px', width: '300px'}}
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label>Hours Worked: </label>
                        <input
                            type="number"
                            name="hours_worked"
                            value={formData.hours_worked}
                            onChange={(e) => setFormData({...formData, hours_worked: e.target.value})}
                            required
                            style={{marginLeft: '10px', padding: '5px'}}
                        />
                    </div>
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Log'}
                    </button>
                    {message && (<p style={{color: message.includes('✅') ? 'green' : 'red', marginTop: '10px'}}> {message} </p> )}
                </form>
            </section>

            
        </div>
    );