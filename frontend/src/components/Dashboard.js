import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    student_progress: [],
    pending_reviews_count: 0,
    admin_performance: {}
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/api/dashboard-stats/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setStats(res.data))
    .catch(err => console.error("Data fetch error:", err));
  }, []);

  // Professional Color Palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f2f5', borderRadius: '12px' }}>
      <h2 style={{ color: '#1a3353', marginBottom: '25px', fontWeight: '700' }}>System Overview</h2>

      {/* Analytics Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle('#fff', '#e74c3c')}>
          <p style={labelStyle}>Pending Reviews</p>
          <h3 style={valueStyle}>{stats.pending_reviews_count}</h3>
        </div>
        
        <div style={cardStyle('#fff', '#2ecc71')}>
          <p style={labelStyle}>Average Performance</p>
          <h3 style={valueStyle}>
            {stats.admin_performance?.avg_score 
              ? `${stats.admin_performance.avg_score.toFixed(1)}%` 
              : "0.0%"}
          </h3>
        </div>

        <div style={cardStyle('#fff', '#3498db')}>
          <p style={labelStyle}>Active Students</p>
          <h3 style={valueStyle}>{stats.student_progress.length}</h3>
        </div>
      </div>

      {/* Main Chart Section */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '25px', 
        borderRadius: '15px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)' 
      }}>
        <h4 style={{ margin: '0 0 20px 0', color: '#4a5568' }}>Weekly Log Submissions</h4>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={stats.student_progress}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
              <XAxis 
                dataKey="student__username" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#718096', fontSize: 12 }} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096' }} />
              <Tooltip 
                cursor={{ fill: '#f7fafc' }}
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="logs_count" radius={[6, 6, 0, 0]} barSize={50}>
                {stats.student_progress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Internal Helper Styles
const cardStyle = (bg, accent) => ({
  flex: 1,
  padding: '25px',
  backgroundColor: bg,
  borderRadius: '15px',
  borderTop: `5px solid ${accent}`,
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
  transition: 'transform 0.2s'
});

const labelStyle = { margin: 0, fontSize: '13px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' };
const valueStyle = { margin: '10px 0 0 0', fontSize: '28px', color: '#2d3748', fontWeight: 'bold' };

export default Dashboard;