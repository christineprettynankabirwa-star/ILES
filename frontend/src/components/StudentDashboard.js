import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const StudentDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [placement, setPlacement] = useState(null);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState('');


    const [weekNumber, setWeekNumber] = useState('');
    const [logContent, setLogContent] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState('Draft');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [logsResponse, placementResponse] = await Promise.all([
                    api.get('weeklylogs/'),
                    api.get('internshipplacements/')
                ]);
                setLogs(logsResponse.data);
                if (placementResponse.data && placementResponse.data.length > 0) {
                    setPlacement(placementResponse.data[0]);
                }
            } catch (err) {
                console.error("Dashboard extraction error:", err);
                setError('Failed to pull system logs or active placement records.');
            } finally {
                setLoading(false);
            } 
        };

        fetchDashboardData();
    }, []);

    const handleLogSubmission = async (e) => {
        e.preventDefault();
        if (!weekNumber || !logContent) {
            alert("Please complete all log fields before executing submission.");
            return;
        }

        try {
            const payload = {
                week_number: parseInt(weekNumber),
                content: logContent,
                status: submissionStatus
            };

            const response = await api.post('weeklylogs/', payload);

            setLogs([response.data, ...logs]);

            setWeekNumber('');
            setLogContent('');
            setSubmissionStatus('Draft');
            alert(`Log entry successfully saved as ${submissionStatus}!`);
        } catch (err) {
            console.error("Submission operational failure:", err);
            alert("Failed to submit entry. Confirm dates and validation constraints.");
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Synchronizing System Core Engine...</div>;

    return (
        <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            {/* System Header */}
            <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '15px', marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', margin: 0 }}>ILES Student Dashboard</h1>
                <p style={{color: '#7f8c8d', margin: '5px 0 0 0' }}>Internship Logging &Evaluation System</p>
            </header>

            {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

            {/* Core Row Split */}
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>

                {/* Left Column: Metrics and Log Creation */}
                <div style={{ flex: '1', minWidth: '350px' }}>

                    {/* Active Placement Overview */}
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e9ecef' }}>
                      <h3 style={{ color: '#34495e', marginTop: 0 }}>Active Placement Information </h3>
                      {placement ? (
                        <div>
                            <p style={{ margin: '8px 0' }}><strong>Company:</strong> {placement.company_name || 'Assigned Institution'}</p>
                            <p style={{ margin: '8px 0' }}><strong>Duration:</strong> {placement.start_date} to {placement.end_date}</p>
                            <p style={{ margin: '8px 0' }}><strong>Status:</strong> <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Confirmed</span></p>
                        </div>
                      ) : (
                       <p style={{color: '#e67e22', fontStyle: 'italic' }}>No active verified placement recoreded. Please coordinate with the Administration.</p> 
                      )}
                      </div>

                      {/* New Weekly log entry form */}
                      <div style={{ background: '#ffffff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #ddd' }}>
                        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>Log Week Task Details</h3>
                        < form onSubmit={handleLogSubmission}>
                        
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Calendar Week Number</label>
                                <input 
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={weekNumber}
                                    onChange={(e) => setWeekNumber(e.target.value)}
                                    placeholder="e.g. 1"
                                    style={{ width: '100%', paddimg: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                />
                            </div>  

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Activities Description</label>
                                <textarea
                                    rows="5"
                                    value={logContent}
                                    onChange={(e) => setLogContent(e.target.value)}
                                    placeholder="Summarize tasks executed, technical skills utilized and workplace milestones achieved..."
                                    style={{ width: '100%', paddimg: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
                                />
                            </div> 

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>WorkFlow State Transition</label>
                                <select
                                    value={submissionStatus}
                                    onChange={(e) => setSubmissionStatus(e.target.value)}
                                    style={{ width: '100%', paddimg: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                >
                                    <option value="Draft">Save as Working Draft (Allows modifications)</option>
                                    <option value="Submitted">Final Submission (Transfers to Supervisor Review queue)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                style={{ width: '100%', padding: '12px', background: '#3498db', color: '#fff', border: 'none', }}>WorkFlow State Transition 
                        </form>
                      )
                      ) 
                      }   
                    </div>
                    
                </div>
            </div>
    )
}
