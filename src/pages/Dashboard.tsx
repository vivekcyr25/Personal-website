import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  Database, 
  Activity, 
  LogOut,
  User as UserIcon,
  Search,
  Grid,
  Home as HomeIcon,
  Zap,
  Layout
} from 'lucide-react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import SecurityBadge from '../components/SecurityBadge';

const Dashboard: React.FC = () => {
  const { user, logout, hasIdentity } = useAuth();

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-chakra flex overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '10px 10px'
        }} />
        
        {/* Moving Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-primary/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-secondary/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Sidebar */}
      <aside className="w-56 border-r border-theme-border bg-theme-bg/40 backdrop-blur-2xl flex flex-col z-20">
        <div className="p-4 border-b border-theme-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-theme-primary rounded flex items-center justify-center font-orbitron font-black text-theme-bg shadow-[0_0_15px_rgba(var(--theme-primary-rgb),0.3)]">
              VS
            </div>
            <div>
              <span className="block font-orbitron text-[10px] tracking-[0.2em] font-bold">NEURAL_OS</span>
              <span className="block text-[7px] font-space-mono text-theme-primary/60 tracking-[0.3em]">VERSION_4.2.0</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Workspace', path: 'workspace' },
            { icon: Grid, label: 'Portfolios', path: 'portfolios' },
            { icon: Database, label: 'Deployments', path: 'deployments' },
            { icon: Activity, label: 'Analytics', path: 'analytics' },
            { icon: Settings, label: 'Config', path: 'config' },
          ].map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group border border-transparent
                ${isActive 
                   ? 'nav-item active' 
                   : 'text-white/40 hover:text-white hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40'}
              `}
            >
              <item.icon size={18} className="transition-transform group-hover:scale-110" />
              <span className="font-space-mono text-[10px] tracking-widest uppercase">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="flex justify-around border-b border-white/5 pb-4">
            <a href="https://github.com/vivekcyr25" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <i className="fab fa-github text-lg"></i>
            </a>
            <a href="https://www.linkedin.com/in/vivek-sharma-2bba8b398/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <i className="fab fa-linkedin text-lg"></i>
            </a>
          </div>
          <div className="space-y-3">
            <SecurityBadge type="FIREBASE" status="ACTIVE" />
            <SecurityBadge type="GEMINI" status="CONNECTED" />
            <SecurityBadge type="SYNC" status="SECURE" />
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white/40 hover:text-theme-accent hover:bg-theme-accent/5 transition-all group"
          >
            <LogOut size={18} />
            <span className="font-space-mono text-[10px] tracking-widest uppercase">Terminate</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative">
        {/* Top Header */}
        <header className="h-14 border-b border-white/10 bg-theme-bg/60 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            {/* Global OS Navigation */}
            <nav className="hidden md:flex items-center gap-2 bg-black/40 p-1 rounded-full border border-white/5 absolute left-1/2 transform -translate-x-1/2">
              {[
                { icon: HomeIcon, label: 'Home', path: '/' },
                { icon: Zap, label: 'Systems', path: '/#systems' },
                { icon: Layout, label: 'Workspace', path: '/dashboard/workspace' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-space-mono uppercase tracking-[0.2em] text-white/70 hover:text-white border border-transparent hover:bg-gradient-to-r hover:from-theme-primary/25 hover:to-transparent hover:border-theme-primary/40 transition-all"
                >
                  <link.icon size={12} />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-orbitron text-white leading-none mb-1 whitespace-nowrap">{user?.displayName?.toUpperCase() || 'ANONYMOUS'}</p>
                <p className={`text-[8px] font-space-mono leading-none tracking-widest ${hasIdentity ? 'text-theme-secondary' : 'text-theme-primary'}`}>
                  {hasIdentity ? 'ARCHITECT_V4' : 'GUEST_ARCHITECT'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-theme-primary/10 border-2 border-theme-primary/40 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_10px_rgba(125,211,252,0.3)]">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-white/20" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 pb-16 scrollbar-thin scrollbar-thumb-theme-primary/20">
          <Outlet />
        </div>
      </div>

      {/* Global OS Ambient FX */}
      <div className="fixed inset-0 cyber-grid opacity-[0.03] pointer-events-none" />
    </div>
  );
};

export default Dashboard;
