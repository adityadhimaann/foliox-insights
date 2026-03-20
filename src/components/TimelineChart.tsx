import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { timelineData, formatCurrency } from '@/lib/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-4 py-3 border"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(0,229,160,0.4)',
      }}
    >
      <p className="font-body text-[13px] text-foreground font-medium mb-1">{label}</p>
      <p className="font-body text-[13px] text-accent-blue">Invested: {formatCurrency(payload[0]?.value)}</p>
      <p className="font-body text-[13px] text-primary">Value: {formatCurrency(payload[1]?.value)}</p>
    </div>
  );
};

const TimelineChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 0.32 }}
    className="glass-card p-6"
  >
    <h3 className="card-section-header mb-1">PORTFOLIO TIMELINE</h3>
    <p className="font-body text-sm text-text-secondary mb-6 ml-[18px]">Your portfolio growth journey</p>
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={timelineData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="investedGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="valueGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5A0" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#00E5A0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'DM Mono', fill: '#4A6080' }} axisLine={{ stroke: 'currentColor', opacity: 0.1 }} tickLine={false} />
          <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11, fontFamily: 'DM Mono', fill: '#4A6080' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="invested" stroke="#3B82F6" fill="url(#investedGrad2)" strokeWidth={2}
            activeDot={{ r: 4, fill: '#3B82F6', stroke: 'rgba(59,130,246,0.3)', strokeWidth: 4 }}
          />
          <Area type="monotone" dataKey="value" stroke="#00E5A0" fill="url(#valueGrad2)" strokeWidth={2}
            activeDot={{ r: 4, fill: '#00E5A0', stroke: 'rgba(0,229,160,0.3)', strokeWidth: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default TimelineChart;
