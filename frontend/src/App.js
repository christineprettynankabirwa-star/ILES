import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';
import ForgotPassword from './pages/ForgotPassword'; 
import InternshipList from "./pages/InternshipList";
import IssueForm from './pages/IssueForm';
import Dashboard from './components/Dashboard';
import logo from './logo.svg';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="App">
        {/* Modern Navigation Bar */}
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
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us</Link>
            {!token ? (
              <>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Signup</Link>
              </>
            ) : (
              <button onClick={handleLogout} style={{ background: '#e74c3c', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                Logout
              </button>
            )}
          </div>
        </nav>

        <div style={{ padding: "20px" }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login" element={<Login setToken={setToken} />} />

            {/* Protected Route (Dashboard / Home) */}
            <Route 
              path="/" 
              element={token ? (
                <>
                  <Dashboard />
                  <hr />
                  <InternshipList />
                  <hr />
                  <IssueForm />
                </>
              ) : (
                <Navigate to="/login" />
              )} 
            />
            
            {/* Redirect any unknown paths to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;