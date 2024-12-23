import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ user, loading, children }) => {
  const location = useLocation();

  // Wait until the user state is initialized
  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator (optional)
  }

  if (!user) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;