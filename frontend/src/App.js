import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Protected pages
import Dashboard from './pages/Dashboard';
import Placements from './pages/Placements';
import WeeklyLogs from './pages/WeeklyLogs';
import Evaluations from './pages/Evaluations';
import Users from './pages/Users';
import Departments from './pages/Departments';
import Criteria from './pages/Criteria';
import Profile from './pages/Profile';

import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public routes ── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── Protected routes (all roles) ── */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/placements" element={<Placements />} />
            <Route path="/weekly-logs" element={<WeeklyLogs />} />
            <Route path="/profile" element={<Profile />} />

            {/* Students + Acad Supervisor + Admin */}
            <Route
              path="/evaluations"
              element={
                <ProtectedRoute roles={['student', 'acad_supervisor', 'admin']}>
                  <Evaluations />
                </ProtectedRoute>
              }
            />

            {/* Admin only */}
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/departments"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Departments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/criteria"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Criteria />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}