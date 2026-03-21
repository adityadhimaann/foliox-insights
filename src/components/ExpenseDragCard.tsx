import { motion } from 'framer-motion';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

interface ExpenseDragProps {
  drag: any;
}

const ExpenseDragCard = ({ drag }: ExpenseDragProps) => (
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
          {(drag.weighted_avg_expense_ratio * 100).toFixed(2)}%
        </p>
        <p className="font-body text-[13px] text-text-muted mt-1">Direct plan benchmark is {(drag.category_avg_expense_ratio * 100).toFixed(1)}%</p>
      </div>
      <div>
        <p className="font-body text-sm text-text-secondary mb-2">10-Year Expense Drag</p>
        <p className="font-mono text-4xl text-accent-warn font-medium" style={{ textShadow: '0 0 30px rgba(255,107,53,0.4)' }}>
          {formatCurrency(drag.ten_year_drag_rupees)}
        </p>
        <p className="font-body text-[13px] text-text-muted mt-1">The potential loss to distribution fees</p>
      </div>
    </div>

    <div className="ml-[18px]">
      <p className="font-body text-sm text-text-secondary mb-4">Real vs Ideal Portfolio growth (10-year projection)</p>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between font-body text-[13px] mb-1.5">
            <span className="text-text-secondary">Current Regular Portfolio</span>
            <span className="font-mono px-2 py-0.5 rounded bg-accent-warn/20 text-accent-warn text-xs">{formatCurrency(drag.corpus_current_plan_10yr)}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-foreground/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FF6B35, #E55A2B)' }}
              initial={{ width: 0 }}
              whileInView={{ width: '70%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-body text-[13px] mb-1.5">
            <span className="text-text-secondary">Direct Plan Alternative</span>
            <span className="font-mono px-2 py-0.5 rounded bg-primary/20 text-primary text-xs">{formatCurrency(drag.corpus_if_direct_10yr)}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-foreground/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00E5A0, #00C48C)' }}
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>
      </div>
      <p className="font-body text-[13px] text-text-muted mt-4">
        Switching to direct plans could save you <span className="text-accent-warn font-medium">{formatCurrency(drag.ten_year_drag_rupees)}</span> over 10 years.
      </p>
    </div>
  </motion.div>
);

export default ExpenseDragCard;
