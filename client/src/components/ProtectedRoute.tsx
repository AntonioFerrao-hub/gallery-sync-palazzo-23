import React from 'react';
import { Redirect } from 'wouter';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;