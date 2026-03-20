import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { timelineData, formatCurrency } from '@/lib/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-body text-[13px] text-text-primary font-medium mb-1">{label}</p>
      <p className="font-body text-[13px] text-primary">Invested: {formatCurrency(payload[0]?.value)}</p>
      <p className="font-body text-[13px] text-accent">Value: {formatCurrency(payload[1]?.value)}</p>
    </div>
  );
};

const TimelineChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-card rounded-xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-shadow duration-200"
  >
    <h3 className="font-body text-lg font-bold text-text-primary mb-1">Invested vs. Current Value Over Time</h3>
    <p className="font-body text-sm text-text-secondary mb-6">Your portfolio growth journey</p>
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={timelineData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F4C81" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#0F4C81" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00C48C" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#00C48C" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'DM Mono', fill: '#8A9BB0' }} />
          <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11, fontFamily: 'DM Mono', fill: '#8A9BB0' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="invested" stroke="#0F4C81" fill="url(#investedGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="value" stroke="#00C48C" fill="url(#valueGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default TimelineChart;
