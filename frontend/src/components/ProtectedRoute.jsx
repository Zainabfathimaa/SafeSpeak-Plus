import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Protects routes based on:
 * 1. User is logged in (has JWT token)
 * 2. User has correct role
 * 
 * Usage:
 * <ProtectedRoute requiredRole="admin" element={<AdminDashboard />} />
 * 
 * If user not logged in → redirects to /login
 * If user role doesn't match → redirects to /dashboard (user home)
 */

export default function ProtectedRoute({ element, requiredRole = null }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has correct role
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      // Not logged in
      if (!token || !user) {
        navigate('/login');
        return;
      }

      // Parse user info
      const userData = JSON.parse(user);

      // Check role if required
      if (requiredRole && userData.role !== requiredRole) {
        console.warn(`Access denied: User is ${userData.role}, needs ${requiredRole}`);
        navigate('/dashboard');
        return;
      }

      // Authorized!
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? element : null;
}
