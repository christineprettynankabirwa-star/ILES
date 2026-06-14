import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
  '/app/dashboard': 'Dashboard',
  '/app/placements': 'Internship Placements',
  '/app/weekly-logs': 'Weekly Logbook',
  '/app/evaluations': 'Evaluations',
  '/app/users': 'User Management',
  '/app/departments': 'Departments',
  '/app/criteria': 'Evaluation Criteria',
  '/app/profile': 'My Profile',
};

export default function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'ILES';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="top-bar">
          <h2>{title}</h2>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}