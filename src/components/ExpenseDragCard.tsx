import { motion } from 'framer-motion';
import { weightedExpenseRatio, tenYearExpenseDrag, formatCurrency } from '@/lib/mockData';

const ExpenseDragCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 0.16 }}
    className="glass-card p-6"
  >
    <h3 className="card-section-header mb-6">EXPENSE ANALYSIS</h3>

    <div className="grid md:grid-cols-2 gap-8 mb-8 ml-[18px]">
      <div>
        <p className="font-body text-sm text-text-secondary mb-2">Weighted Avg. Expense Ratio</p>
        <p className="font-mono text-4xl text-accent-warn font-medium" style={{ textShadow: '0 0 30px rgba(255,107,53,0.4)' }}>
          {weightedExpenseRatio}%
        </p>
        <p className="font-body text-[13px] text-text-muted mt-1">Category avg. is 0.9% for direct plans</p>
      </div>
      <div>
        <p className="font-body text-sm text-text-secondary mb-2">10-Year Expense Drag</p>
        <p className="font-mono text-4xl text-accent-warn font-medium" style={{ textShadow: '0 0 30px rgba(255,107,53,0.4)' }}>
          {formatCurrency(tenYearExpenseDrag)}
        </p>
        <p className="font-body text-[13px] text-text-muted mt-1">The silent cost of regular plans</p>
      </div>
    </div>

    <div className="ml-[18px]">
      <p className="font-body text-sm text-text-secondary mb-4">Your Regular Plan vs Direct Plan (10-year projection)</p>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between font-body text-[13px] mb-1.5">
            <span className="text-text-secondary">Regular Plan</span>
            <span className="font-mono px-2 py-0.5 rounded bg-accent-warn/20 text-accent-warn text-xs">₹18.2L</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FF6B35, #E55A2B)' }}
              initial={{ width: 0 }}
              whileInView={{ width: '72%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-body text-[13px] mb-1.5">
            <span className="text-text-secondary">Direct Plan</span>
            <span className="font-mono px-2 py-0.5 rounded bg-primary/20 text-primary text-xs">₹21.4L</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00E5A0, #00C48C)' }}
              initial={{ width: 0 }}
              whileInView={{ width: '85%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>
      </div>
      <p className="font-body text-[13px] text-text-muted mt-4">
        Switching to direct plans could save you <span className="text-accent-warn font-medium">₹3.2L</span> over 10 years.
      </p>
    </div>
  </motion.div>
);

export default ExpenseDragCard;
