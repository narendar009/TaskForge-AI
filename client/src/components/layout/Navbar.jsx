import { motion } from 'framer-motion';
import { Zap, Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'TF';

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-16 glass border-b border-white/8 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30 flex-shrink-0"
    >
      {/* Mobile hamburger — hidden on desktop */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Brand logo — mobile only (desktop shows in sidebar) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Zap size={13} className="text-white" />
        </div>
        <span className="font-bold text-white text-sm leading-none">TaskForge</span>
      </div>

      {/* Spacer — pushes right-side actions to the end */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Search — placeholder, expands on click in future */}
        <button
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all"
          aria-label="Search"
          title="Search (coming soon)"
        >
          <Search size={17} />
        </button>

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          aria-label="Notifications"
        >
          <Bell size={17} />
          {/* Unread dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 hidden sm:block" />

        {/* User avatar + info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-violet-500/30">
            {initials}
          </div>
          <div className="hidden md:block leading-none">
            <div className="text-sm font-semibold text-slate-200 truncate max-w-[120px]">
              {user?.name ?? 'User'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[120px]">
              {user?.email ?? ''}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
