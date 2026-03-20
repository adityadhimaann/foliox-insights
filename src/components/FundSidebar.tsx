import { motion } from 'framer-motion';
import { scoreBreakdown, funds, niftyXirr, formatCurrency } from '@/lib/mockData';

const FundSidebar = () => (
  <aside className="w-full lg:w-[340px] bg-card border-r border-border p-6 space-y-8">
    {/* Score Breakdown */}
    <div>
      <h3 className="font-body text-base font-bold text-text-primary mb-5">Health Score Breakdown</h3>
      <div className="space-y-4">
        {scoreBreakdown.map((item, i) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-body text-sm text-text-primary">{item.category}</span>
              <span className="font-mono text-sm text-primary">{item.score}/{item.max}</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(item.score / item.max) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.06 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="h-px bg-border" />

    {/* Fund Summary */}
    <div>
      <h3 className="font-body text-base font-bold text-text-primary mb-4">Fund Summary</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {funds.map((fund, i) => (
          <motion.div
            key={fund.shortName}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className="p-3 rounded-xl border border-border hover:shadow-md transition-shadow duration-200"
          >
            <p className="font-body text-[13px] text-text-primary leading-snug line-clamp-2 mb-1.5">{fund.name}</p>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-primary/10 text-primary">
                {fund.category}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`font-mono text-sm font-medium ${fund.xirr >= niftyXirr ? 'text-accent' : 'text-accent-warn'}`}>
                {fund.xirr}% XIRR
              </span>
              <span className="font-mono text-[13px] text-text-secondary">{formatCurrency(fund.currentValue)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </aside>
);

export default FundSidebar;
