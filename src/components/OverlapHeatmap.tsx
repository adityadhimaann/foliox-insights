import { motion } from 'framer-motion';
import { funds, overlapMatrix } from '@/lib/mockData';
import { AlertTriangle } from 'lucide-react';

const shortNames = funds.map(f => f.shortName);

const getCellStyle = (value: number, isSelf: boolean) => {
  if (isSelf) return { background: 'rgba(255,255,255,0.03)', color: '#4A6080' };
  if (value > 60) return { background: 'rgba(255,107,53,0.28)', color: '#FF4500', border: '1px solid rgba(255,107,53,0.5)', boxShadow: '0 0 12px rgba(255,107,53,0.2)' };
  if (value > 40) return { background: 'rgba(255,107,53,0.15)', color: '#FF6B35' };
  if (value > 20) return { background: 'rgba(245,158,11,0.10)', color: '#D97706' };
  return { background: 'rgba(0,229,160,0.06)', color: '#4A6080' };
};

const OverlapHeatmap = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 0.08 }}
    className="glass-card p-6"
  >
    <h3 className="card-section-header mb-1">FUND OVERLAP ANALYSIS</h3>
    <p className="font-body text-sm text-text-secondary mb-6 ml-[18px]">High overlap means you're not as diversified as you think.</p>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2" />
            {shortNames.map(name => (
              <th key={name} className="p-2 font-mono text-[11px] text-text-muted font-normal text-center whitespace-nowrap">{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shortNames.map((row, ri) => (
            <tr key={row}>
              <td className="p-2 font-mono text-[11px] text-text-muted whitespace-nowrap text-right pr-3">{row}</td>
              {shortNames.map((col, ci) => {
                const isSelf = row === col;
                const value = overlapMatrix[row]?.[col] ?? 0;
                const style = getCellStyle(value, isSelf);
                return (
                  <td key={col} className="p-1.5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: ri * 0.05 + ci * 0.03 }}
                      className="rounded-lg text-center font-mono text-[13px] py-2 px-1"
                      style={style}
                    >
                      {isSelf ? '—' : `${value}%`}
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-6 flex gap-3 p-4 rounded-r-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,107,53,0.06))',
        borderLeft: '3px solid #FF6B35',
      }}
    >
      <AlertTriangle className="w-5 h-5 text-accent-warn flex-shrink-0 mt-0.5" style={{ animation: 'warn-pulse 2s infinite' }} />
      <p className="font-body text-sm text-foreground">
        <strong>Mirae Asset Large Cap</strong> and <strong>Axis Bluechip Fund</strong> share 58% of their top holdings. Consider consolidating.
      </p>
    </div>
  </motion.div>
);

export default OverlapHeatmap;
