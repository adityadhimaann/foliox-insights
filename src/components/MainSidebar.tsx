import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  LineChart, 
  ShieldCheck, 
  History, 
  Settings, 
  HelpCircle, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/results' },
  { icon: LineChart, label: 'Portfolio X-Ray', path: '/results', badge: 'New' },
  { icon: ShieldCheck, label: 'Rebalancing', path: '/results' },
  { icon: FileText, label: 'Tax Reports', path: '/results' },
];

const RECENTS = [
  { name: 'Aditya_Portfolio_Mar.pdf', date: '2 hours ago' },
  { name: 'Family_Trust_Final.pdf', date: '1 day ago' },
];

const MainSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.aside 
      initial={{ width: 80 }}
      animate={{ width: isHovered ? 280 : 80 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/40 bg-background/50 backdrop-blur-3xl z-[999] shadow-2xl overflow-hidden group"
    >
      {/* Branding Section */}
      <div className="p-6 mb-8 flex items-center gap-4 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
           <TrendingUp className="w-5 h-5 text-primary-foreground font-bold" />
        </div>
        <AnimatePresence>
          {isHovered && (
             <motion.span 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               className="font-heading text-xl font-bold text-foreground whitespace-nowrap"
             >
                Folio<span className="text-primary italic">X</span>
             </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="group flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-all text-text-secondary hover:text-foreground relative"
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isHovered ? 'group-hover:text-primary' : 'text-primary'}`} strokeWidth={2} />
            <AnimatePresence>
               {isHovered && (
                 <motion.span 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="font-body text-sm font-medium whitespace-nowrap"
                 >
                   {item.label}
                 </motion.span>
               )}
            </AnimatePresence>
            {item.badge && isHovered && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-tighter"
              >
                {item.badge}
              </motion.span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isHovered && (
              <div className="absolute left-16 px-2 py-1 rounded bg-foreground text-background text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[1000]">
                {item.label}
              </div>
            )}
          </Link>
        ))}

        {/* Recents Section */}
        <div className="pt-8 space-y-4 overflow-hidden">
          <div className="px-3 flex items-center justify-between">
            {isHovered && (
               <motion.span 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="font-heading text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted/60"
               >
                 Recents
               </motion.span>
            )}
            <History className="w-4 h-4 text-text-muted/40" />
          </div>
          {isHovered && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-1"
             >
                {RECENTS.map((recent) => (
                  <button key={recent.name} className="w-full group flex flex-col items-start px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
                     <span className="w-full text-left font-body text-[12px] text-text-secondary truncate group-hover:text-foreground">
                        {recent.name}
                     </span>
                     <span className="font-body text-[10px] text-text-muted">
                        {recent.date}
                     </span>
                  </button>
                ))}
             </motion.div>
          )}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border/40 space-y-1 overflow-hidden">
         <button className="w-full group flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-all text-text-secondary hover:text-foreground">
            <Settings className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
            {isHovered && <span className="font-body text-sm">Settings</span>}
         </button>
         <button className="w-full group flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-all text-text-secondary hover:text-foreground">
            <HelpCircle className="w-5 h-5 opacity-60 group-hover:opacity-100" />
            {isHovered && <span className="font-body text-sm">Feedback</span>}
         </button>
      </div>
    </motion.aside>
  );
};

export default MainSidebar;
