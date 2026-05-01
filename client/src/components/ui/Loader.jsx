import { motion } from 'framer-motion';

/* ── Inline SVG spinner ── */
export function Spinner({ size = 24, className = '' }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      style={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ── Full-page loader (used during auth checks) ── */
export function FullPageLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-500"
      />
      <p className="text-slate-500 text-sm">Loading TaskForge…</p>
    </div>
  );
}

/* ── Skeleton task card ── */
function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="skeleton h-3.5 rounded-full w-3/4" />
        <div className="skeleton w-3 h-3 rounded" />
      </div>
      <div className="skeleton h-2.5 rounded-full w-full" />
      <div className="skeleton h-2.5 rounded-full w-5/6" />
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-3 w-14 rounded-full" />
      </div>
    </div>
  );
}

/* ── Skeleton column ── */
function SkeletonColumn({ cards = 3 }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="skeleton w-2.5 h-2.5 rounded-full" />
          <div className="skeleton h-3 w-20 rounded-full" />
        </div>
        <div className="skeleton h-5 w-6 rounded-full" />
      </div>
      {/* Cards */}
      <div className="p-3 flex flex-col gap-2.5">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

/* ── Full kanban skeleton — matches actual grid breakpoints ── */
export function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SkeletonColumn cards={3} />
      <SkeletonColumn cards={2} />
      <SkeletonColumn cards={4} />
    </div>
  );
}
