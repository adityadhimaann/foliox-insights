import { motion } from 'framer-motion';
import { Download, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

interface SummaryBarProps {
  analysis: any;
}

const SummaryBar = ({ analysis }: SummaryBarProps) => {
  const score = Math.round(analysis.health_score.total_score);

  return (
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
      <div className="mx-auto px-6 md:px-10 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="p-2 rounded-full border border-border/40 text-text-muted hover:text-foreground transition-all hover:bg-foreground/5 bg-background/40">
             <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-4">
            <ScoreRing score={score} />
            <div>
              <p className="font-body text-[11px] text-text-muted mb-0.5">Health Score</p>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl md:text-3xl font-bold text-primary leading-none"
                  style={{ textShadow: '0 0 20px rgba(0,229,160,0.5)' }}
                >{score}</span>
                <span className="font-mono text-sm text-text-muted">/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 flex-wrap">
          {[
            { value: `${(analysis.total_xirr * 100).toFixed(1)}%`, label: 'Total XIRR', color: 'text-primary' },
            { value: `${(analysis.benchmark.benchmark_xirr * 100).toFixed(1)}%`, label: analysis.benchmark.benchmark_name, color: 'text-accent-warn' },
            { value: formatCurrency(analysis.total_current_value), label: 'Market Value', color: 'text-foreground' },
          ].map(stat => (
            <div key={stat.label} className="px-4 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex flex-col items-center min-w-[100px]">
              <p className={`font-mono text-base md:text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="font-body text-[9px] text-text-muted uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="h-9 px-3 rounded-lg border border-border-glow text-foreground font-body text-xs flex items-center gap-2 transition-all duration-150 hover:bg-foreground/5 bg-background/20"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <Download className="w-3.5 h-3.5" /> Reports
          </button>
          <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-body text-[13px] font-bold flex items-center gap-2 transition-all duration-150 hover:brightness-110 shadow-lg shadow-primary/20"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryBar;
