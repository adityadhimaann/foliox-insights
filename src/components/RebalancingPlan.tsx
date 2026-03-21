import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface RebalancingPlanProps {
  recommendations: any[];
}

const borderColors: Record<string, string> = {
  'high': '#00E5A0',
  'medium': '#3B82F6',
  'consider': '#F59E0B',
};

const PriorityIcon = ({ priority }: { priority: string }) => {
  if (priority === 'high') return <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />;
  if (priority === 'medium') return <Info className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />;
  return <AlertTriangle className="w-5 h-5 text-accent-warn flex-shrink-0 mt-0.5" />;
};

const RebalancingPlan = ({ recommendations }: RebalancingPlanProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 0.24 }}
    className="relative rounded-[20px] p-6 overflow-hidden glass-card border-primary/20"
    style={{
      background: 'linear-gradient(180deg, rgba(0,229,160,0.1), transparent 100%), var(--bg-card)',
      backdropFilter: 'blur(20px)',
    }}
  >
    <div className="absolute top-0 right-0 w-[60px] h-[60px] pointer-events-none"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(0,229,160,0.4)',
      }}
    />

    <h3 className="card-section-header mb-6">AI ACTION PLAN</h3>

    <div className="space-y-4 ml-[18px]">
      {recommendations.map((rec, i) => (
        <motion.div
          key={i}
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 400, damping: 40, delay: i * 0.15 }}
          className="flex gap-3 p-4 rounded-xl hover:bg-foreground/5 transition-colors duration-200 bg-foreground/5"
          style={{
            borderLeft: `3px solid ${borderColors[rec.priority] || '#F59E0B'}`,
          }}
        >
          <PriorityIcon priority={rec.priority} />
          <div>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-body font-medium mb-1.5 uppercase tracking-wider ${
              rec.priority === 'high' ? 'bg-primary/15 text-primary border border-primary/20' : 
              rec.priority === 'medium' ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/20' :
              'bg-accent-warn/15 text-accent-warn border border-accent-warn/20'
            }`}>
              {rec.priority} Priority
            </span>
            <p className="font-heading text-[16px] text-foreground font-semibold mb-1 ">{rec.action}</p>
            <p className="font-body text-[13.5px] text-text-secondary leading-relaxed">{rec.detail}</p>
            {rec.estimated_impact && (
               <p className="font-mono text-[11px] text-primary mt-2 font-bold tracking-tight">
                 ★ EST. IMPACT: {rec.estimated_impact}
               </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-8 pt-4 border-t border-border/40 ml-[18px]">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-body text-primary border border-primary/15 bg-primary/10"
      >
        ✦ Optimized by FolioX Agentic AI · Results may vary based on market conditions
      </span>
    </div>
  </motion.div>
);

export default RebalancingPlan;
