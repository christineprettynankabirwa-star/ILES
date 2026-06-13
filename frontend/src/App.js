import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import AboutUs from './pages/AboutUs';
import ForgotPassword from './pages/ForgotPassword'; 
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import AcademicSupervisorDashboard from './components/AcademicSupervisorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LandingSite from './pages/LandingSite';



function App() {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return (savedToken && savedToken !== "undefined" && savedToken !== "null") ? savedToken : null;
  });

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    } else {
      localStorage.setItem('token', token);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userRole');
    setToken(null);
  };

  const getDashboardRoute = (userRole) => {
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'supervisor' || userRole === 'academic_supervisor' || userRole === 'acad_supervisor') {
      return '/academic-supervisor-dashboard';
    }
    return '/student-dashboard';
  };

  return (
    <Router>
      <div className="App">
        {token && (
          <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '15px 30px', 
            background: '#2c3e50', 
            color: 'white',
            alignItems: 'center' 
          }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>ILES Portal</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to={getDashboardRoute(localStorage.getItem('userRole'))} style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us</Link>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: '#e74c3c', 
                  border: 'none', 
                  color: 'white', 
                  padding: '5px 10px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Logout
              </button>
            </div>
          </nav>
        )}

        <div style={{ padding: token ? "20px" : "0px" }}>
          <Routes>
            <Route path="/" element={<LandingSite />} />

            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/academic-supervisor-dashboard" 
              element={
                <ProtectedRoute>
                  <AcademicSupervisorDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="/about" element={<AboutUs />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/signup" element={!token ? <Signup /> : <Navigate to={getDashboardRoute(localStorage.getItem('userRole'))} />} />
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to={getDashboardRoute(localStorage.getItem('userRole'))} />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;