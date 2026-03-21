import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';

interface XirrChartProps {
  benchmark: any;
  funds: any[];
}

const XirrChart = ({ benchmark, funds }: { benchmark: any; funds: any[] }) => {
  const benchmarkXirr = Math.round(benchmark.benchmark_xirr * 1000) / 10;
  
  const chartData = funds.map(f => ({
    name: f.fund_name.split(' ').slice(0, 2).join(' '),
    fullName: f.fund_name,
    xirr: Math.round(f.xirr * 1000) / 10
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const val = payload[0].value;
    const fullName = payload[0].payload.fullName;
    const delta = (val - benchmarkXirr).toFixed(1);
    const isAbove = val >= benchmarkXirr;
    return (
      <div className="rounded-lg px-4 py-3 border"
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(0,229,160,0.4)',
        }}
      >
        <p className="font-body text-[13px] text-foreground font-medium mb-1">{fullName}</p>
        <p className="font-mono text-sm text-primary">{val}% XIRR</p>
        <p className={`font-mono text-xs mt-1 ${isAbove ? 'text-primary' : 'text-accent-warn'}`}>
          {isAbove ? '+' : ''}{delta}% vs {benchmark.benchmark_name}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="card-section-header mb-1">FUND XIRR VS. {benchmark.benchmark_name.toUpperCase()}</h3>
      <p className="font-body text-sm text-text-secondary mb-6 ml-[18px]">
        How each fund compares to {benchmark.benchmark_name} returns
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="barGradientGood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5A0" />
                <stop offset="100%" stopColor="#00C48C" />
              </linearGradient>
              <linearGradient id="barGradientWarn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#E55A2B" />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'DM Mono', fill: '#4A6080' }} axisLine={{ stroke: 'currentColor', opacity: 0.1 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono', fill: '#4A6080' }} unit="%" axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <ReferenceLine y={benchmarkXirr} stroke="#3B82F6" strokeDasharray="4 4" strokeWidth={2}
              label={{ value: `${benchmark.benchmark_name} ${benchmarkXirr}%`, position: 'right', fontSize: 10, fontFamily: 'DM Mono', fill: '#3B82F6' }}
            />
            <Bar dataKey="xirr" radius={[4, 4, 0, 0]} maxBarSize={48} isAnimationActive animationDuration={800} animationEasing="ease-out">
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.xirr >= benchmarkXirr ? 'url(#barGradientGood)' : 'url(#barGradientWarn)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default XirrChart;
