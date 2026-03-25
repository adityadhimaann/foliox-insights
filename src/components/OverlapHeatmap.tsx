import { motion } from 'framer-motion';

interface OverlapHeatmapProps {
  matrix: any[];
  funds: any[];
}

const getCellStyle = (value: number, isSelf: boolean) => {
  if (isSelf) return { background: 'var(--bg-muted)', color: '#4A6080' };
  if (value >= 50) return { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }; // High - Red
  if (value >= 30) return { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }; // Mod - Orange
  if (value > 0) return { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }; // Low - Green
  return { background: 'rgba(16, 185, 129, 0.05)', color: '#4A6080' }; // Zero/Unknown
};

const formatOverlap = (val: number) => {
  if (val >= 50) return `~${val}% high`;
  if (val >= 30) return `~${val}% mod`;
  if (val > 0) return `~${val}% low`;
  return `0%`;
};

const nameMap: Record<string, string> = {
  "Mirae Asset Large Cap Fund": "Mirae LC",
  "Axis Bluechip Fund": "Axis BC",
  "Parag Parikh Flexi Cap Fund": "PP Flexi",
  "HDFC Mid-Cap Opportunities Fund": "HDFC Mid",
  "SBI Small Cap Fund": "SBI Small Cap"
};

const OverlapHeatmap = ({ matrix, funds }: OverlapHeatmapProps) => {
  // Sort funds to match the exact order in the mock image
  const orderedNames = ["Mirae Asset Large Cap Fund", "Axis Bluechip Fund", "Parag Parikh Flexi Cap Fund", "HDFC Mid-Cap Opportunities Fund", "SBI Small Cap Fund"];
  const sortedFunds = [...funds].sort((a, b) => orderedNames.indexOf(a.fund_name) - orderedNames.indexOf(b.fund_name));
  
  const fundNames = sortedFunds.map(f => f.fund_name);
  const shortNames = fundNames.map(name => nameMap[name] || name.split(' ').slice(0, 2).join(' '));

  // Create a 2D map for easy lookup
  const overlapData: Record<string, Record<string, number>> = {};
  matrix.forEach(pair => {
    if (!overlapData[pair.fund_a]) overlapData[pair.fund_a] = {};
    if (!overlapData[pair.fund_b]) overlapData[pair.fund_b] = {};
    const rounded = Math.round(pair.overlap_percentage * 100);
    overlapData[pair.fund_a][pair.fund_b] = rounded;
    overlapData[pair.fund_b][pair.fund_a] = rounded;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="glass-card p-6 md:p-8"
    >
      <p className="font-body text-sm text-text-secondary leading-relaxed mb-6">
        High overlap means your money is effectively concentrated in fewer real positions than you think. The two large-cap funds share the most holdings.
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2" />
              {shortNames.map((name, i) => (
                <th key={i} className="p-2 font-mono text-xs text-text-secondary font-medium text-center whitespace-nowrap">{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fundNames.map((rowName, ri) => (
              <tr key={ri}>
                <td className="p-2 font-mono text-xs text-text-secondary whitespace-nowrap text-right pr-4 font-medium">{shortNames[ri]}</td>
                {fundNames.map((colName, ci) => {
                  const isSelf = rowName === colName;
                  const value = overlapData[rowName]?.[colName] ?? 0;
                  const style = getCellStyle(value, isSelf);
                  return (
                    <td key={ci} className="p-1.5">
                      <motion.div
                        className="rounded-lg text-center font-body text-[13px] font-medium py-2.5 px-2"
                        style={style}
                      >
                        {isSelf ? '—' : formatOverlap(value)}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-foreground/5 p-4 rounded-xl border border-border/40">
        <p className="font-body text-sm text-text-secondary leading-relaxed">
          <strong className="text-foreground">Key finding:</strong> Mirae Asset Large Cap and Axis Bluechip have ~65% portfolio overlap — they hold nearly identical top stocks (HDFC Bank, Reliance, Infosys, ICICI Bank, TCS). Holding both is redundant. Parag Parikh stands apart because it holds global stocks (Google, Meta, Amazon) not found in other funds — it provides genuine diversification. SBI Small Cap and HDFC Mid-Cap have minimal overlap with anything else.
        </p>
      </div>

      <div className="mt-10 pt-8 border-t border-border/40">
        <p className="font-body text-[13px] text-text-secondary uppercase tracking-widest mb-8">Portfolio allocation — current value</p>
        <div className="flex flex-col md:flex-row items-center justify-center md:items-start gap-12">
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-sm">
             <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-sm bg-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5"><p className="font-body text-sm font-medium text-foreground">Mirae LC — ₹3.03L</p><p className="font-mono text-[11px] text-text-muted">(29.6%)</p></div>
             </div>
             <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5"><p className="font-body text-sm font-medium text-foreground">PP Flexi Cap — ₹3.67L</p><p className="font-mono text-[11px] text-text-muted">(35.8%)</p></div>
             </div>
             <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-sm bg-amber-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5"><p className="font-body text-sm font-medium text-foreground">SBI Small Cap — ₹1.36L</p><p className="font-mono text-[11px] text-text-muted">(13.3%)</p></div>
             </div>
             <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-sm bg-purple-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5"><p className="font-body text-sm font-medium text-foreground">HDFC Mid-Cap — ₹1.29L</p><p className="font-mono text-[11px] text-text-muted">(12.6%)</p></div>
             </div>
             <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-sm bg-red-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5"><p className="font-body text-sm font-medium text-foreground">Axis BC — ₹0.89L</p><p className="font-mono text-[11px] text-text-muted">(8.7%)</p></div>
             </div>
          </div>

          <div className="relative w-full max-w-[220px] aspect-square flex-shrink-0">
             <div className="absolute inset-0 rounded-full" style={{
                background: `conic-gradient(
                  #3B82F6 0% 29.6%,
                  #10B981 29.6% 65.4%,
                  #F59E0B 65.4% 78.7%,
                  #A855F7 78.7% 91.3%,
                  #EF4444 91.3% 100%
                )`
             }} />
             <div className="absolute inset-[25%] rounded-full" style={{ background: 'var(--bg-card)' }} />
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default OverlapHeatmap;
