import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Placements from './pages/Placements';
import WeeklyLogs from './pages/WeeklyLogs';
import Evaluations from './pages/Evaluations';
import Users from './pages/Users';
import Departments from './pages/Departments';
import Criteria from './pages/Criteria';
import Profiles from './pages/Profiles';
import AboutUs from './pages/AboutUs';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<AboutUs />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="placements" element={<Placements />} />
            <Route path="weekly-logs" element={<WeeklyLogs />} />
            <Route
              path="evaluations"
              element={
                <ProtectedRoute roles={['student', 'acad_supervisor', 'admin']}>
                  <Evaluations />
                </ProtectedRoute>
              }
            />
            <Route path="profile" element={<Profiles />} />
            <Route
              path="users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="departments"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Departments />
                </ProtectedRoute>
              }
            />
            <Route
              path="criteria"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Criteria />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}