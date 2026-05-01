import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ icon: Icon, label, value, color, trend, trendLabel }) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden h-full cursor-default"
    >
      {/* Ambient glow in the corner */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-25 blur-2xl pointer-events-none"
        style={{ background: color }}
      />

      {/* Top row: icon + trend badge */}
      <div className="flex items-center justify-between relative z-10">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${color}1a`,
            border: `1px solid ${color}40`,
          }}
        >
          <Icon size={21} style={{ color }} />
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              trend >= 0
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Bottom: value + label */}
      <div className="relative z-10">
        <div className="text-3xl font-extrabold text-white tabular-nums leading-none">
          {value}
        </div>
        <div className="text-sm font-medium text-slate-400 mt-1">{label}</div>
        {trendLabel && (
          <div className="text-xs text-slate-600 mt-0.5">{trendLabel}</div>
        )}
      </div>

      {/* Subtle bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-40"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </motion.div>
  );
}
