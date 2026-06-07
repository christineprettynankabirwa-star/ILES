import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import LandingSite from './pages/LandingSite';
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
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="App">
        {/* Render global app header navbar ONLY if user is authenticated */}
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
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
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
            {/* Dynamic Root Route */}
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
                <LandingSite />
              )} 
            />

            {/* Public Auth & Marketing Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />
            <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Catch-all Wildcard Redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;