import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Login from './pages/Login';
import InternshipList from "./pages/InternshipList";
import IssueForm from './pages/IssueForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
  }, []);

  return (
    <Router>
      <div className="App" style={{ padding: "20px" }}>
        <h1>ILES Internship System</h1>
        
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login setToken={setToken} />} />

          {/* Protected Routes: Only accessible if token exists */}
          <Route 
            path="/" 
            element={token ? (
              <>
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
    </Router>
  );
}

export default App;
