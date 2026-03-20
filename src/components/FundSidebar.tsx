import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { scoreBreakdown, funds, niftyXirr, formatCurrency } from '@/lib/mockData';

const ScoreRing = ({ score }: { score: number }) => {
  const size = 160;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative flex items-center justify-center mx-auto mb-6">
      {/* Glow base */}
      <div className="absolute w-[120px] h-4 rounded-full opacity-15 blur-lg"
        style={{ background: 'radial-gradient(circle, hsl(160 100% 45%), transparent)', bottom: '-8px' }}
      />
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5A0" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="glowDot">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(0,229,160,0.8)" />
          </filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={stroke} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#scoreGradient)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circ }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[42px] text-primary font-medium" style={{ textShadow: '0 0 20px rgba(0,229,160,0.5)' }}>{score}</span>
        <span className="font-mono text-base text-text-muted">/100</span>
        <span className="font-body text-[11px] text-text-muted uppercase tracking-wider mt-0.5">Health Score</span>
      </div>
    </div>
  );
};

const FundSidebar = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleFunds = showAll ? funds : funds.slice(0, 3);

  return (
    <aside className="w-full lg:w-[340px] lg:border-r border-border/40 p-6 space-y-6">
      <ScoreRing score={72} />

      {/* Score Breakdown */}
      <div>
        <h3 className="card-section-header mb-4">Health Score Breakdown</h3>
        <div className="space-y-4">
          {scoreBreakdown.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-body text-sm text-text-secondary">{item.category}</span>
                <span className="font-mono text-[13px] text-primary">{item.score}/{item.max}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-foreground/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #00E5A0, #3B82F6)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.score / item.max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/40" />

      {/* Fund Summary */}
      <div>
        <h3 className="card-section-header mb-4">Fund Summary</h3>
        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 snap-x snap-mandatory">
          {funds.map((fund, i) => (
            <motion.div
              key={fund.shortName}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex-shrink-0 snap-center w-[260px] glass-card !rounded-xl p-4"
            >
              <p className="font-body text-[13px] text-foreground leading-snug line-clamp-2 mb-2">{fund.name}</p>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-primary-dim text-primary border border-primary/10 mb-2">
                {fund.category}
              </span>
              <div className="flex justify-between items-center">
                <span className={`font-mono text-sm font-medium ${fund.xirr >= niftyXirr ? 'text-primary' : 'text-accent-warn'}`}>
                  {fund.xirr}% XIRR
                </span>
                <span className="font-mono text-[13px] text-text-secondary">{formatCurrency(fund.currentValue)}</span>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Desktop: vertical list */}
        <div className="hidden lg:block space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {visibleFunds.map((fund, i) => (
            <motion.div
              key={fund.shortName}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="p-3 rounded-xl border border-border/40 hover:bg-primary-dim hover:border-l-2 hover:border-l-primary transition-all duration-150"
            >
              <p className="font-body text-[13px] text-foreground leading-snug line-clamp-2 mb-1.5">{fund.name}</p>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-primary-dim text-primary border border-primary/10 mb-1.5">
                {fund.category}
              </span>
              <div className="flex justify-between items-center">
                <span className={`font-mono text-sm font-medium ${fund.xirr >= niftyXirr ? 'text-primary' : 'text-accent-warn'}`}
                  style={fund.xirr >= niftyXirr ? { textShadow: '0 0 8px rgba(0,229,160,0.3)' } : {}}
                >
                  {fund.xirr}% XIRR
                </span>
                <span className="font-mono text-[13px] text-text-secondary">{formatCurrency(fund.currentValue)}</span>
              </div>
            </motion.div>
          ))}
          {!showAll && funds.length > 3 && (
            <button onClick={() => setShowAll(true)} className="w-full text-center font-body text-sm text-primary hover:underline py-2">
              Show all {funds.length} funds
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FundSidebar;
