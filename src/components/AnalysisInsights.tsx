import { motion } from 'framer-motion';
import { Info, Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const InsightSection = ({ icon: Icon, title, content, status }: { icon: any, title: string, content: string, status?: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="py-4 border-b border-border/40 last:border-0 relative overflow-hidden group"
  >
    <div className="flex items-center gap-3 mb-3">
       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
       </div>
       <h4 className="font-heading text-[13px] font-bold uppercase tracking-widest text-foreground">{title}</h4>
    </div>
    <p className="font-body text-[13px] text-text-secondary leading-relaxed">
       {content}
    </p>
    {status && (
      <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter py-1 px-2 rounded-md bg-foreground/5 border border-border w-fit text-text-muted">
         <Sparkles className="w-3 h-3 text-primary" /> {status}
      </div>
    )}
  </motion.div>
);

const AnalysisInsights = () => {
  return (
    <aside className="hidden xl:block w-[320px] p-6 space-y-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar border-l border-border/40 bg-background/20 backdrop-blur-sm">
      <div className="space-y-6 pt-4">
         <InsightSection 
            icon={TrendingUp}
            title="Expense Drag"
            content="Your portfolio is losing 1.82% annually due to regular plan commissions. Transitioning to direct plans will save you roughly ₹3.2L over a decade — effective immediately."
            status="Action Required"
         />

         <InsightSection 
            icon={AlertTriangle}
            title="Overlap Risk"
            content="We detected a 58% overlap between your top 3 equity funds. This means you are essentially paying multiple AMC fees for the exact same stock exposure."
            status="High Overlap"
         />

         <InsightSection 
            icon={CheckCircle2}
            title="Timeline Projection"
            content="Based on current market volatility and your fund selection, your portfolio is on track to hit its ₹10L milestone 14 months earlier if rebalanced."
            status="Growth Optimized"
         />

         <div className="pt-6 border-t border-border/40">
           <div className="p-4 rounded-xl bg-foreground/5 border border-dashed border-border flex flex-col items-center text-center gap-3">
              <Info className="w-5 h-5 text-text-muted" />
              <p className="font-body text-[12px] text-text-muted">
                 Click on any card in the main dashboard to see detailed fund-level attribution.
              </p>
           </div>
         </div>
      </div>
    </aside>
  );
};

export default AnalysisInsights;
