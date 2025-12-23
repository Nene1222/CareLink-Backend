import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress className="w-12 h-12 text-blue-500" />
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
