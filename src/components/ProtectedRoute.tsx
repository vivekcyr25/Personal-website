import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center font-orbitron">
        <div className="relative">
          <div className="w-24 h-24 border-2 border-theme-primary/20 rounded-full animate-ping absolute inset-0" />
          <div className="w-24 h-24 border-2 border-theme-primary border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(var(--theme-primary-rgb),0.4)]" />
        </div>
        <div className="mt-12 space-y-2 text-center">
          <p className="text-theme-primary text-xs tracking-[0.5em] animate-pulse uppercase">Initializing_Neural_Link</p>
          <p className="text-white/20 text-[8px] font-space-mono uppercase tracking-widest">Loading Platform Assets...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
