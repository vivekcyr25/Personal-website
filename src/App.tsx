import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Dashboard Sub-pages
const Workspace = lazy(() => import('./pages/dashboard/Workspace'));
const Portfolios = lazy(() => import('./pages/dashboard/Portfolios'));
const Deployments = lazy(() => import('./pages/dashboard/Deployments'));
const Analytics = lazy(() => import('./pages/dashboard/Analytics'));
const Config = lazy(() => import('./pages/dashboard/Config'));
const Preview = lazy(() => import('./pages/Preview'));

// Legal Pages
const Terms = lazy(() => import('./pages/legal/Terms'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const AIGovernance = lazy(() => import('./pages/legal/AIGovernance'));

const LoadingScreen = () => (
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

const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                >
                  <Route index element={<Navigate to="workspace" replace />} />
                  <Route path="workspace" element={<Workspace />} />
                  <Route path="portfolios" element={<Portfolios />} />
                  <Route path="deployments" element={<Deployments />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="config" element={<Config />} />
                </Route>
                <Route path="/preview/:portfolioId" element={<Preview />} />
                
                {/* Legal Routes */}
                <Route path="/legal/terms" element={<Terms />} />
                <Route path="/legal/privacy" element={<Privacy />} />
                <Route path="/legal/ai-governance" element={<AIGovernance />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
