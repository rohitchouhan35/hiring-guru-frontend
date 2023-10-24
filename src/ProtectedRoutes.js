import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStateContext } from './contexts/ContextProvider';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

const ProtectedRoutes = ({ path, ...props }) => {
  const { isLoggedIn, validateToken } = useStateContext();

  if (isLoggedIn && validateToken(localStorage.getItem('token'))) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
