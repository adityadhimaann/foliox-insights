import { motion } from 'framer-motion';
import { portfolioScore, portfolioXirr, niftyXirr, formatCurrency, totalCorpus } from '@/lib/mockData';
import { Download, Share2 } from 'lucide-react';

const ScoreRing = ({ score }: { score: number }) => {
  const size = 80;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <svg width={size} height={size} className="flex-shrink-0 hidden md:block">
      <defs>
        <linearGradient id="miniRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5A0" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" className="text-foreground/10" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#miniRingGrad)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
    </svg>
  );
};

const SummaryBar = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="w-full border-b border-border/40"
    style={{
      background: 'linear-gradient(180deg, rgba(0,229,160,0.1), transparent 100%), var(--bg-card)',
      backdropFilter: 'blur(20px)',
    }}
  >
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <ScoreRing score={portfolioScore} />
        <div>
          <p className="font-body text-[13px] text-text-muted mb-1">Portfolio Health Score</p>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-5xl md:text-[64px] font-bold text-primary leading-none"
              style={{ textShadow: '0 0 20px rgba(0,229,160,0.5)' }}
            >{portfolioScore}</span>
            <span className="font-mono text-2xl md:text-[28px] text-text-muted">/100</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 md:gap-4 flex-wrap">
        {[
          { value: `${portfolioXirr}%`, label: 'Your XIRR', color: 'text-primary' },
          { value: `${niftyXirr}%`, label: 'Nifty 50 XIRR', color: 'text-accent-warn' },
          { value: formatCurrency(totalCorpus), label: 'Total Value', color: 'text-foreground' },
        ].map(stat => (
          <div key={stat.label} className="px-5 py-2 rounded-lg border border-border/40 bg-foreground/5">
            <p className={`font-mono text-xl md:text-2xl ${stat.color}`}>{stat.value}</p>
            <p className="font-body text-[11px] text-text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="h-10 px-4 rounded-lg border border-border-glow text-foreground font-body text-sm flex items-center gap-2 transition-all duration-150 hover:bg-foreground/5"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <Download className="w-4 h-4" /> Download
        </button>
        <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-body text-sm flex items-center gap-2 transition-all duration-150 hover:brightness-110"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  </motion.div>
);

export default SummaryBar;
