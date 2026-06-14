import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/placements': 'Internship Placements',
  '/weekly-logs': 'Weekly Logbook',
  '/evaluations': 'Evaluations',
  '/users': 'User Management',
  '/departments': 'Departments',
  '/criteria': 'Evaluation Criteria',
  '/profile': 'My Profile',
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