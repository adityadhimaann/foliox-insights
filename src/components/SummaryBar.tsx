import { motion } from 'framer-motion';
import { portfolioScore, portfolioXirr, niftyXirr, formatCurrency, totalCorpus } from '@/lib/mockData';
import { Download, Share2 } from 'lucide-react';

const AnimatedNumber = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
  return (
    <span>
      {prefix}{value}{suffix}
    </span>
  );
};

const SummaryBar = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-bg-dark w-full"
  >
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Score */}
      <div className="flex items-baseline gap-1">
        <div>
          <p className="font-body text-[13px] text-text-muted mb-1">Portfolio Health Score</p>
          <span className="font-mono text-5xl md:text-[64px] font-bold text-primary-foreground leading-none">
            <AnimatedNumber value={portfolioScore} />
          </span>
          <span className="font-mono text-2xl md:text-[28px] text-text-muted">/100</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex gap-8 md:gap-12">
        <div>
          <p className="font-mono text-2xl md:text-[28px] text-accent"><AnimatedNumber value={portfolioXirr} suffix="%" /></p>
          <p className="font-body text-xs text-text-muted mt-0.5">Your XIRR</p>
        </div>
        <div>
          <p className="font-mono text-2xl md:text-[28px] text-accent-warn"><AnimatedNumber value={niftyXirr} suffix="%" /></p>
          <p className="font-body text-xs text-text-muted mt-0.5">Nifty 50 XIRR</p>
        </div>
        <div>
          <p className="font-mono text-2xl md:text-[28px] text-primary-foreground">{formatCurrency(totalCorpus)}</p>
          <p className="font-body text-xs text-text-muted mt-0.5">Total Value</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="h-10 px-4 rounded-lg border border-white/20 text-primary-foreground font-body text-sm flex items-center gap-2 transition-all duration-150 hover:bg-white/5">
          <Download className="w-4 h-4" /> Download Report
        </button>
        <button className="h-10 px-4 rounded-lg bg-accent text-accent-foreground font-body text-sm flex items-center gap-2 transition-all duration-150 hover:brightness-110">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  </motion.div>
);

export default SummaryBar;
