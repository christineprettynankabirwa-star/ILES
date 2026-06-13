import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import ForgotPassword from "./pages/ForgotPassword";
import LandingSite from "./pages/LandingSite";

import Dashboard from "./components/Dashboard";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AcademicSupervisorDashboard from "./components/AcademicSupervisorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  background: "#2c3e50",
  color: "white",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
};

const logoutButtonStyle = {
  background: "#e74c3c",
  border: "none",
  color: "white",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};

function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken && storedToken !== "undefined" && storedToken !== "null"
      ? storedToken
      : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userRole");
    setToken(null);
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case "admin":
        return "/admin-dashboard";

      case "supervisor":
      case "academic_supervisor":
      case "acad_supervisor":
        return "/academic-supervisor-dashboard";

      default:
        return "/student-dashboard";
    }
  };

  const userRole = localStorage.getItem("userRole");
  const dashboardRoute = getDashboardRoute(userRole);

  return (
    <Router>
      <div className="App">
        {token && (
          <nav style={navStyle}>
            <h2 style={{ margin: 0 }}>ILES Portal</h2>

            <div style={{ display: "flex", gap: "20px" }}>
              <Link to={dashboardRoute} style={linkStyle}>
                Dashboard
              </Link>

              <Link to="/about" style={linkStyle}>
                About Us
              </Link>

              <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout
              </button>
            </div>
          </nav>
        )}

        <div style={{ padding: token ? "20px" : "0" }}>
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

            <Route
              path="/signup"
              element={!token ? <Signup /> : <Navigate to={dashboardRoute} />}
            />

            <Route
              path="/login"
              element={
                !token ? (
                  <Login setToken={setToken} />
                ) : (
                  <Navigate to={dashboardRoute} />
                )
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;