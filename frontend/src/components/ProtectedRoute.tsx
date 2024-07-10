import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Correct the usage of jwtDecode
    const decodedToken: { exp: number } = jwtDecode(token);
    return decodedToken.exp > Date.now() / 1000;
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to="/Login" />;
};

export default ProtectedRoute;
