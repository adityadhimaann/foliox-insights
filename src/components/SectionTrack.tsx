import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Zap, BarChart3, Activity, Layers, Repeat } from 'lucide-react';

const TRACK_ITEMS = [
  { id: 'expense', label: 'Expense', sub: 'Burn Analysis', icon: CreditCard, step: '01' },
  { id: 'overlap', label: 'Overlap', sub: 'Clarity Scan', icon: Layers, step: '02' },
  { id: 'action', label: 'Actions', sub: 'Optimization', icon: Zap, step: '03' },
  { id: 'rebalance', label: 'Rebalance', sub: 'Wealth Flow', icon: Repeat, step: '04' },
  { id: 'timeline', label: 'Journey', sub: 'Projection', icon: BarChart3, step: '05' },
];

const SectionTrack = ({ activeId }: { activeId: string }) => {
  return (
    <aside className="hidden xl:flex flex-col items-center justify-center py-20 w-[140px] sticky top-16 h-[calc(100vh-64px)] overflow-hidden border-r border-border/10 bg-background/5">
      {/* Background Decorative Line (Dashed) */}
      <div className="absolute left-[34px] top-12 bottom-12 w-[2px] border-l-2 border-dashed border-border/30 z-0" />
      
      <div className="relative z-10 flex flex-col items-start gap-12 h-full pl-6">
         {TRACK_ITEMS.map((item, i) => {
            const isActive = activeId === item.id;
            return (
              <motion.div 
                 key={item.id} 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="flex items-center gap-4 group cursor-pointer relative"
                 onClick={() => {
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                 }}
              >
                 {/* Node: Step + Icon context */}
                 <div className="relative flex flex-col items-center">
                    <motion.div 
                      animate={isActive ? { scale: 1.1, borderColor: 'rgba(0,229,160,0.5)', boxShadow: '0 0 20px rgba(0,229,160,0.15)' } : { scale: 1, borderColor: 'rgba(0,0,0,0.1)' }}
                      whileHover={{ scale: 1.1 }}
                      className={`w-10 h-10 rounded-xl bg-background border flex items-center justify-center transition-all z-20 relative overflow-hidden shadow-sm ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-primary group-hover:border-primary/50'}`}
                    >
                       <div className={`absolute inset-0 bg-primary/0 ${isActive ? 'bg-primary/5' : 'group-hover:bg-primary/5'} transition-colors`} />
                       <item.icon className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                    </motion.div>
                    
                    {/* Step label behind node */}
                    <span className={`absolute -top-3 -right-3 font-mono text-[9px] font-bold transition-colors bg-background px-1 z-30 border border-border/20 rounded-sm ${isActive ? 'text-primary border-primary/40' : 'text-text-muted/40 group-hover:text-primary'}`}>
                       {item.step}
                    </span>
                 </div>
                 
                 {/* Horizontal Text Label System */}
                 <div className="flex flex-col">
                    <span className={`font-heading text-[11px] font-bold uppercase tracking-widest transition-all ${isActive ? 'text-foreground' : 'text-text-muted group-hover:text-foreground'}`}>
                       {item.label}
                    </span>
                    <span className={`font-body text-[9px] font-medium tracking-tight whitespace-nowrap overflow-hidden transition-all ${isActive ? 'text-primary' : 'text-text-muted/30 group-hover:text-primary'}`}>
                       {item.sub}
                    </span>
                 </div>
                 
                 {/* Active Accent Dot */}
                 <motion.div 
                    animate={isActive ? { scale: 1 } : { scale: 0 }}
                    className="absolute -left-[30px] w-2 h-2 rounded-full border border-primary/20 bg-primary shadow-[0_0_10px_rgba(0,229,160,0.8)]" 
                 />
              </motion.div>
            );
         })}
         
         {/* Bottom Status / Footer of track */}
         <div className="mt-auto pb-4 flex flex-col items-center gap-2 opacity-20">
            <Activity className="w-4 h-4 text-text-muted" />
            <div className="h-12 w-px bg-gradient-to-b from-border/40 to-transparent" />
         </div>
      </div>
    </aside>
  );
};

export default SectionTrack;
