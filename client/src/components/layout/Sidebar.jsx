import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  LayoutDashboard,
  CheckSquare,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard', icon: CheckSquare, label: 'My Tasks' },
];

function SidebarContent({ onClose }) {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Brand logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
            <Zap size={17} className="text-white" />
          </div>
          <div className="leading-none">
            <div className="font-extrabold text-white text-sm tracking-tight">TaskForge</div>
            <div className="text-[10px] text-violet-400 font-bold tracking-widest uppercase mt-0.5">
              AI
            </div>
          </div>
        </div>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all"
          aria-label="Close sidebar"
        >
          <X size={15} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2 select-none">
          Workspace
        </p>

        {NAV_LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={label}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/25'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/6'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className="flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight size={13} className="text-violet-400 opacity-60" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section + logout */}
      <div className="p-3 border-t border-white/8 flex-shrink-0">
        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 bg-white/4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(user?.name ?? user?.email ?? 'U').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-300 truncate">
              {user?.name ?? 'User'}
            </div>
            <div className="text-[10px] text-slate-600 truncate">{user?.email ?? ''}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop: fixed-width sidebar, never overlaps content */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 glass border-r border-white/8 h-screen sticky top-0">
        <SidebarContent onClose={onClose} />
      </aside>

      {/* Mobile: animated slide-in drawer + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Semi-transparent overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 glass border-r border-white/8 lg:hidden flex flex-col"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
