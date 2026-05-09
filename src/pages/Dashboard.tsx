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
      {/* Sidebar */}
      <aside className="w-64 border-r border-theme-border bg-theme-bg/40 backdrop-blur-2xl flex flex-col z-20">
        <div className="p-8 border-b border-theme-border">
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

        <nav className="flex-1 p-6 space-y-2">
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
                w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group
                ${isActive 
                   ? 'bg-theme-primary/10 text-theme-primary border border-theme-primary/20 shadow-[0_0_15px_rgba(var(--theme-primary-rgb),0.1)]' 
                   : 'text-white/40 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={18} className="transition-transform group-hover:scale-110" />
              <span className="font-space-mono text-[10px] tracking-widest uppercase">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-6">
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
      <div className="flex-1 flex flex-col min-w-0 max-w-screen-2xl mx-auto w-full relative">
        {/* Top Header */}
        <header className="h-20 border-b border-white/10 bg-theme-bg/60 backdrop-blur-md px-4 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 md:gap-10">
            <div className="flex flex-col">
              <h2 className="font-orbitron text-sm font-black tracking-[0.3em] uppercase neural-glow">COMMAND_CENTER</h2>
              <span className="text-[8px] font-space-mono text-white/30 uppercase tracking-[0.2em] hidden sm:block">Cluster: {hasIdentity ? 'Authorized_Node' : 'Restricted_Access'}</span>
            </div>
            
            {/* Global OS Navigation */}
            <nav className="hidden md:flex items-center gap-2 bg-black/40 p-1 rounded-full border border-white/5">
              {[
                { icon: HomeIcon, label: 'Home', path: '/' },
                { icon: Zap, label: 'Systems', path: '/#systems' },
                { icon: Layout, label: 'Workspace', path: '/dashboard/workspace' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-space-mono uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <link.icon size={12} />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden xl:block relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="SEARCH_NEURAL_CLUSTER..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 px-10 text-[9px] font-space-mono focus:outline-none focus:border-theme-primary w-64 transition-all"
              />
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-4 md:pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-orbitron text-white leading-none mb-1">{user?.displayName?.toUpperCase() || 'ANONYMOUS'}</p>
                <p className={`text-[8px] font-space-mono leading-none tracking-widest ${hasIdentity ? 'text-theme-secondary' : 'text-theme-primary'}`}>
                  {hasIdentity ? 'ARCHITECT_V4' : 'GUEST_ARCHITECT'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center overflow-hidden shrink-0">
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
