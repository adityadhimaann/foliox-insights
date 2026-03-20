import { motion } from 'framer-motion';
import { funds, overlapMatrix } from '@/lib/mockData';
import { AlertTriangle } from 'lucide-react';

const shortNames = funds.map(f => f.shortName);

const getCellColor = (value: number, isSelf: boolean) => {
  if (isSelf) return 'bg-border';
  if (value > 60) return 'bg-accent-warn/30';
  if (value > 30) return 'bg-accent-warn/15';
  return 'bg-transparent';
};

const OverlapHeatmap = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-card rounded-xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-shadow duration-200"
  >
    <h3 className="font-body text-lg font-bold text-text-primary mb-1">Fund Overlap Analysis</h3>
    <p className="font-body text-sm text-text-secondary mb-6">High overlap means you're not as diversified as you think.</p>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2" />
            {shortNames.map(name => (
              <th key={name} className="p-2 font-mono text-[11px] text-text-muted font-normal text-center whitespace-nowrap">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shortNames.map(row => (
            <tr key={row}>
              <td className="p-2 font-mono text-[11px] text-text-muted whitespace-nowrap text-right pr-3">{row}</td>
              {shortNames.map(col => {
                const isSelf = row === col;
                const value = overlapMatrix[row]?.[col] ?? 0;
                return (
                  <td
                    key={col}
                    className={`p-2 text-center font-mono text-[13px] rounded-md ${getCellColor(value, isSelf)} ${
                      value > 50 && !isSelf ? 'text-accent-warn font-medium' : 'text-text-secondary'
                    }`}
                  >
                    {isSelf ? '—' : `${value}%`}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-6 flex gap-3 p-4 rounded-xl border-l-4 border-accent-warn bg-accent-warn/5">
      <AlertTriangle className="w-5 h-5 text-accent-warn flex-shrink-0 mt-0.5" />
      <p className="font-body text-sm text-text-primary">
        <strong>Mirae Asset Large Cap</strong> and <strong>Axis Bluechip Fund</strong> share 58% of their top holdings. Consider consolidating into one fund.
      </p>
    </div>
  </motion.div>
);

export default OverlapHeatmap;
