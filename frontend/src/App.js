import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';

import StudentDashboard from './components/StudentDashboard';

import ProtectedRoute from './components/ProtectedRoute';



function App() {

  return (

    <Router>

      <Routes>

        <Route path="/login" element={<Login />} />

        

        {/* Temporary direct route to test it quickly */}

        <Route path="/dashboard" element={<StudentDashboard />} />



        {/* Or protected route (once auth logic is ready per Week 4 guidelines) */}

        {/* 

        <Route path="/dashboard" element={

          <ProtectedRoute allowedRoles={['Student']}>

            <StudentDashboard />

          </ProtectedRoute>

        } /> 

        */}

      </Routes>

    </Router>

  );

}



export default App;