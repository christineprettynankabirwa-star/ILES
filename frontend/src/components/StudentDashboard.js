import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    studentName: "Student", 
    placement: { company: "Tech Solutions Ltd", status: "Approved" },
    metrics: { totalLogsSubmitted: 6, pendingReviews: 2, finalScore: 85.5 },
    weeklyPerformance: [
      { week: 'Week 1', score: 80 },
      { week: 'Week 2', score: 85 },
      { week: 'Week 3', score: 78 },
      { week: 'Week 4', score: 90 },
      { week: 'Week 5', score: 88 },
      { week: 'Week 6', score: 92 },
    ]
  });

  const [logForm, setLogForm] = useState({
    weekNumber: '',
    activities: '',
    challenges: '',
    status: 'Draft'
  });

  const [loading, setLoading] = useState(true);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const storedUser = localStorage.getItem('user'); 
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setDashboardData(prevState => ({
            ...prevState,
            studentName: userObj.name || userObj.username || "Student"
          }));
        }
      } catch (error) {
        console.error("Error reading authentication data from localStorage:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = (e, targetStatus) => {
    e.preventDefault();
    
    if (!logForm.weekNumber || !logForm.activities) {
      setFormMessage({ type: 'error', text: 'Please complete the week number and activity fields.' });
      return;
    }

    setFormMessage({ 
      type: 'success', 
      text: `Log entry for Week ${logForm.weekNumber} saved successfully as "${targetStatus}"!` 
    });

    if (targetStatus === 'Submitted') {
      setDashboardData(prevState => ({
        ...prevState,
        metrics: {
          ...prevState.metrics,
          totalLogsSubmitted: prevState.metrics.totalLogsSubmitted + 1
        }
      }));
    }

    setLogForm({ weekNumber: '', activities: '', challenges: '', status: 'Draft' });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h3>Loading Student Dashboard...</h3>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Welcome Back, {dashboardData.studentName}!</h2>
        <p><strong>Current Placement:</strong> {dashboardData.placement.company} ({dashboardData.placement.status})</p>
      </header>

      <hr style={styles.divider} />

      <div style={styles.grid}>
        <div style={styles.card}>
          <h4>Total Logs Submitted</h4>
          <p style={styles.metricValue}>{dashboardData.metrics.totalLogsSubmitted}</p>
        </div>
        <div style={styles.card}>
          <h4>Pending Supervisor Reviews</h4>
          <p style={styles.metricValue}>{dashboardData.metrics.pendingReviews}</p>
        </div>
        <div style={styles.card}>
          <h4>Current Evaluation Score</h4>
          <p style={styles.metricValue}>{dashboardData.metrics.finalScore}%</p>
        </div>
      </div>

      <div style={styles.contentLayout}>
        <div style={styles.formContainer}>
          <h3>Submit Weekly Logbook Entry</h3>
          
          {formMessage.text && (
            <div style={{
              ...styles.alert,
              backgroundColor: formMessage.type === 'success' ? '#DEF7EC' : '#FDE8E8',
              color: formMessage.type === 'success' ? '#03543F' : '#9B1C1C'
            }}>
              {formMessage.text}
            </div>
          )}

          <form style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Week Number</label>
              <input 
                type="number" 
                name="weekNumber"
                value={logForm.weekNumber}
                onChange={handleInputChange}
                placeholder="e.g. 7" 
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tasks &amp; Activities Undertaken</label>
              <textarea 
                name="activities"
                value={logForm.activities}
                onChange={handleInputChange}
                placeholder="Describe your activities for this week..." 
                rows="4"
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Challenges Faced &amp; Lessons Learned</label>
              <textarea 
                name="challenges"
                value={logForm.challenges}
                onChange={handleInputChange}
                placeholder="Any roadblocks or critical insights gained..." 
                rows="3"
                style={styles.textarea}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={(e) => handleFormSubmit(e, 'Draft')} 
                style={styles.draftButton}
              >
                Save Draft
              </button>
              <button 
                type="button" 
                onClick={(e) => handleFormSubmit(e, 'Submitted')} 
                style={styles.submitButton}
              >
                Submit Logbook
              </button>
            </div>
          </form>
        </div>

        <div style={styles.chartContainer}>
          <h3>Weekly Performance Progress</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={dashboardData.weeklyPerformance}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                  name="Evaluation Score (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '20px',
  },
  divider: {
    border: '0',
    height: '1px',
    background: '#E5E7EB',
    marginBottom: '30px',
  },
  grid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  },
  card: {
    flex: '1',
    minWidth: '220px',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #E5E7EB',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4F46E5',
    margin: '10px 0 0 0',
  },
  contentLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '30px',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #E5E7EB',
  },
  form: {
    marginTop: '15px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    boxSizing: 'border-box',
    fontSize: '0.95rem',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    boxSizing: 'border-box',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  draftButton: {
    padding: '10px 20px',
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #E5E7EB',
  },
  alert: {
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  }
};

export default StudentDashboard;