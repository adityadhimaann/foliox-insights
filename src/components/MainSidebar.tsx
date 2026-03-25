import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  LineChart, 
  ShieldCheck, 
  History, 
  Settings as SettingsIcon, 
  HelpCircle, 
  TrendingUp,
  FileText,
  Send,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: LineChart, label: 'Portfolio X-Ray', path: '/results', badge: 'New' },
  { icon: ShieldCheck, label: 'Rebalancing', path: '/results#rebalance' },
  { icon: FileText, label: 'Tax Reports', path: '/results#action' },
];

const RECENTS = [
  { name: 'Aditya_Portfolio_Mar.pdf', date: '2 hours ago' },
  { name: 'Family_Trust_Final.pdf', date: '1 day ago' },
];

const MainSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recents, setRecents] = useState<any[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path.includes('#') && location.pathname === path.split('#')[0]) {
      e.preventDefault();
      const id = path.split('#')[1];
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fetch real recents/history from backend
  useEffect(() => {
    if (!token) return;
    const fetchRecents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Filter to just take top 3 latest items from backend
          const uploads = data.slice(0, 3);
          setRecents(uploads);
        }
      } catch (err) {
        console.error("Failed to fetch recents:", err);
      }
    };
    fetchRecents();
  }, [token]);

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;
    setIsSending(true);
    try {
      const response = await fetch('http://localhost:8000/api/user/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: feedback })
      });

      if (response.ok) {
        toast.success("Thank you for your feedback!");
        setFeedback('');
        setIsOpen(false);
      } else {
        throw new Error("Failed to send feedback");
      }
    } catch (err) {
      toast.error("Could not send feedback. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

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
        <Link to="/" className="flex items-center gap-4">
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
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
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
                {recents.map((recent, i) => (
                   <button key={i} className="w-full group flex flex-col items-start px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors">
                      <span className="w-full text-left font-body text-[12px] text-text-secondary truncate group-hover:text-foreground capitalize">
                         {recent.action?.replace('_',' ')}
                      </span>
                      <span className="font-body text-[9px] text-text-muted">
                         {new Date(recent.timestamp).toLocaleDateString()}
                      </span>
                   </button>
                ))}
                {recents.length === 0 && (
                  <p className="px-3 text-[11px] text-text-muted/40 italic">No recent activity</p>
                )}
             </motion.div>
          )}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border/40 space-y-1 overflow-hidden">
         <Link 
           to="/settings"
           className="w-full group flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-all text-text-secondary hover:text-foreground"
         >
            <SettingsIcon className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
            {isHovered && <span className="font-body text-sm">Settings</span>}
         </Link>
         
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
           <DialogTrigger asChild>
             <button className="w-full group flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-all text-text-secondary hover:text-foreground">
                <HelpCircle className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                {isHovered && <span className="font-body text-sm">Feedback</span>}
             </button>
           </DialogTrigger>
           <DialogContent className="!fixed glass-card sm:max-w-md bg-background/80 backdrop-blur-2xl border-border/40">
             <DialogHeader>
               <DialogTitle className="font-heading text-2xl flex items-center gap-2">
                 <HelpCircle className="w-6 h-6 text-primary" />
                 Share your thoughts
               </DialogTitle>
               <DialogDescription className="font-body text-text-muted">
                 Help us improve FolioX. Your feedback goes directly to our engineering team.
               </DialogDescription>
             </DialogHeader>
             <div className="py-4">
               <Textarea
                 placeholder="What's on your mind? Found a bug or have a suggestion?"
                 value={feedback}
                 onChange={(e) => setFeedback(e.target.value)}
                 className="min-h-[120px] bg-foreground/5 border-border/40 font-body focus:border-primary/50 transition-colors"
               />
             </div>
             <DialogFooter>
               <Button
                 onClick={handleSendFeedback}
                 disabled={!feedback.trim() || isSending}
                 className="w-full bg-primary text-secondary font-bold hover:bg-primary/90 flex items-center gap-2"
               >
                 {isSending ? (
                   <>
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Sending...
                   </>
                 ) : (
                   <>
                     <Send className="w-4 h-4" />
                     Submit Feedback
                   </>
                 )}
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
      </div>
    </motion.aside>
  );
};

export default MainSidebar;
