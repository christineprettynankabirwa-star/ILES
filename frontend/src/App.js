import React from "react";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { DepartmentsProvider } from "./context/DepartmentsContext";

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

import Dashboard from './components/Dashboard';
import Placements from './pages/Placements';
import WeeklyLogs from './pages/WeeklyLogs';
import Evaluations from './pages/Evaluations';
import Users from './pages/Users';
import Departments from './pages/Departments';
import Criteria from './pages/Criteria';
import Profile from './pages/Profiles';

import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<DepartmentsProvider><Register /></DepartmentsProvider>} />
            <Route path="/signup" element={<DepartmentsProvider><Register /></DepartmentsProvider>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute><DepartmentsProvider><Layout /></DepartmentsProvider></ProtectedRoute>}>
              <Route path="/app/dashboard" element={<Dashboard />} />
              <Route path="/app/placements" element={<Placements />} />
              <Route path="/app/weekly-logs" element={<WeeklyLogs />} />
              <Route path="/app/profile" element={<Profile />} />
              <Route path="/app/evaluations" element={<ProtectedRoute roles={['student','acad_supervisor','admin']}><Evaluations academic_supervisor /></ProtectedRoute>} />
              <Route path="/app/users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
              <Route path="/app/departments" element={<ProtectedRoute roles={['admin']}><Departments /></ProtectedRoute>} />
              <Route path="/app/criteria" element={<ProtectedRoute roles={['admin']}><Criteria /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
