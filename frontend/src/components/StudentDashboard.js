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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Try to get the logged-in user's name from localStorage (set during login)
        const storedUser = localStorage.getItem('user'); 
        
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          
          setDashboardData(prevState => ({
            ...prevState,
            studentName: userObj.name || userObj.username || "Authenticated Student"
          }));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        {/* This dynamically displays the logged in user's name */}
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
  chartContainer: {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #E5E7EB',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  }
};

export default StudentDashboard;