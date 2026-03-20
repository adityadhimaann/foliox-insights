import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { funds, niftyXirr } from '@/lib/mockData';

const chartData = funds.map(f => ({
  name: f.shortName,
  xirr: f.xirr,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-body text-[13px] text-text-primary font-medium">{label}</p>
      <p className="font-mono text-sm text-accent">{payload[0].value}% XIRR</p>
    </div>
  );
};

const XirrChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-card rounded-xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-shadow duration-200"
  >
    <h3 className="font-body text-lg font-bold text-text-primary mb-1">XIRR vs. Benchmark</h3>
    <p className="font-body text-sm text-text-secondary mb-6">How each fund compares to Nifty 50 returns</p>
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'DM Mono', fill: '#8A9BB0' }} />
          <YAxis tick={{ fontSize: 12, fontFamily: 'DM Mono', fill: '#8A9BB0' }} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={niftyXirr} stroke="#0F4C81" strokeDasharray="6 4" label={{ value: `Nifty ${niftyXirr}%`, position: 'right', fontSize: 11, fontFamily: 'DM Mono', fill: '#0F4C81' }} />
          <Bar dataKey="xirr" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.xirr >= niftyXirr ? '#00C48C' : '#FF6B35'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default XirrChart;
