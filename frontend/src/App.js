import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import LandingSite from './pages/LandingSite';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';
import ForgotPassword from './pages/ForgotPassword'; 
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return (savedToken && savedToken !== "undefined" && savedToken !== "null") ? savedToken : null;
  });

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken(null);
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
              <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
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
            {/* Public landing page — no auth required */}
            <Route path="/" element={<LandingSite />} />

            {/* Protected dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <>
                    <Dashboard />
                    <hr />
                  </>
                </ProtectedRoute>
              } 
            />

            {/* Public pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Auth routes — redirect to dashboard if already logged in */}
            <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />

            {/* 2. Make sure it is registered and protected*/}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;