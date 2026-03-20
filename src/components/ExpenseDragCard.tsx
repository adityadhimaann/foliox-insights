import { motion } from 'framer-motion';
import { weightedExpenseRatio, tenYearExpenseDrag, formatCurrency } from '@/lib/mockData';

const ExpenseDragCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-card rounded-xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-shadow duration-200"
  >
    <h3 className="font-body text-lg font-bold text-text-primary mb-6">What You're Paying in Expenses</h3>

    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <div>
        <p className="font-body text-sm text-text-secondary mb-2">Weighted Avg. Expense Ratio</p>
        <p className="font-mono text-4xl text-accent-warn font-medium">{weightedExpenseRatio}%</p>
        <p className="font-body text-[13px] text-text-muted mt-1">Category avg. is 0.9% for direct plans</p>
      </div>
      <div>
        <p className="font-body text-sm text-text-secondary mb-2">10-Year Expense Drag</p>
        <p className="font-mono text-4xl text-accent-warn font-medium">{formatCurrency(tenYearExpenseDrag)}</p>
        <p className="font-body text-[13px] text-text-muted mt-1">The silent cost of regular plans</p>
      </div>
    </div>

    <div>
      <p className="font-body text-sm text-text-secondary mb-3">Your Regular Plan vs Direct Plan (10-year projection)</p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between font-body text-[13px] mb-1">
            <span className="text-text-secondary">Regular Plan</span>
            <span className="font-mono text-text-primary">₹18.2L</span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent-warn"
              initial={{ width: 0 }}
              whileInView={{ width: '72%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-body text-[13px] mb-1">
            <span className="text-text-secondary">Direct Plan</span>
            <span className="font-mono text-text-primary">₹21.4L</span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              whileInView={{ width: '85%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>
      </div>
      <p className="font-body text-[13px] text-text-muted mt-3">Switching to direct plans could save you ₹3.2L over 10 years.</p>
    </div>
  </motion.div>
);

export default ExpenseDragCard;
