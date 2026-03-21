import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, X, User, CheckCircle2, TrendingUp, Shield, Zap, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FEATURES = [
  { icon: TrendingUp, title: 'Real-time XIRR Tracking', desc: 'Monitor your true compounded annual returns effortlessly.' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'Your data is encrypted and never leaves your session.' },
  { icon: Zap, title: 'Instant Analysis', desc: 'Upload to insights in under 10 seconds flat.' },
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isLogin = mode === 'login';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLogin ? {
           email: formData.email,
           password: formData.password
        } : formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      if (isLogin) {
        setAuth(data.user, data.access_token);
        toast.success(`Welcome back, ${data.user.username}!`);
        onClose();
      } else {
        toast.success("Account created! You can now sign in.");
        setMode('login');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/70 backdrop-blur-lg pointer-events-auto"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[960px] relative z-10 glass-card p-0 flex flex-col md:flex-row shadow-2xl overflow-hidden border-white/20 pointer-events-auto min-h-[600px]"
            style={{ 
               background: 'rgba(255, 255, 255, 0.85)',
               boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Close Button UI */}
            <button 
               onClick={onClose}
               className="flex absolute top-6 right-6 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-text-muted transition-colors z-[110]"
            >
               <X className="w-5 h-5" />
            </button>

            {/* Left Panel: Auth Form */}
            <motion.div 
               initial={{ x: 200, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.6, delay: 0.2, ease: "circOut" }}
               className="w-full md:w-[480px] p-8 md:p-16 relative bg-background/40"
            >
               {/* Branding */}
               <div className="flex items-center gap-2 mb-10">
                  <span className="font-heading text-2xl tracking-tight">
                    <span className="text-foreground">Folio</span>
                    <span className="text-primary italic">X</span>
                  </span>
               </div>

               <div className="text-center mb-10 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <h1 className="font-heading text-3xl text-foreground mb-3 font-semibold tracking-tight">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                      </h1>
                      <p className="font-body text-text-secondary text-sm">
                        {mode === 'login' ? 'Sign in to your private wealth protocol' : 'Start your automated wealth journey today'}
                      </p>
                    </motion.div>
                  </AnimatePresence>
               </div>

               <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-3 relative">
                     <AnimatePresence mode="popLayout">
                       {mode === 'signup' && (
                          <motion.div 
                             key="name-field"
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: 20 }}
                             className="relative group focus-within:z-10"
                          >
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                             <input 
                               type="text" 
                               placeholder="Full Name (for username)" 
                               required
                               disabled={loading}
                               value={formData.username}
                               onChange={(e) => setFormData({...formData, username: e.target.value})}
                               className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-body text-sm text-foreground"
                             />
                          </motion.div>
                       )}
                     </AnimatePresence>
                     
                     <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          required
                          disabled={loading}
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-body text-sm text-foreground"
                        />
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                          type="password" 
                          placeholder={mode === 'login' ? 'Password' : 'Create Password'} 
                          required
                          disabled={loading}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-body text-sm text-foreground"
                        />
                     </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {mode === 'login' && (
                       <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between text-[11px] font-body overflow-hidden py-1"
                       >
                          <label className="flex items-center gap-2 text-text-secondary cursor-pointer hover:text-foreground transition-colors group">
                             <input type="checkbox" className="w-3.5 h-3.5 rounded border-border accent-primary focus:ring-primary/20" />
                             <span>Remember me</span>
                          </label>
                          <a href="#" className="text-primary hover:underline font-medium">Forgot Password?</a>
                       </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-heading text-base font-bold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-4 relative overflow-hidden group/btn disabled:opacity-70"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loading ? 'loading' : mode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        {loading ? (
                           <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                           <>
                             {mode === 'login' ? 'Sign In' : 'Get Started'} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                           </>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </button>
               </form>

               {/* Divider */}
               <div className="flex items-center gap-4 my-8">
                  <div className="h-px bg-border flex-1" />
                  <span className="font-body text-[10px] text-text-muted uppercase tracking-widest font-bold">Or continue with</span>
                  <div className="h-px bg-border flex-1" />
               </div>

               {/* Social icons */}
               <div className="flex justify-center items-center gap-10">
                  <button className="relative group transition-transform hover:scale-110 active:scale-95">
                     <div className="absolute -inset-4 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200" />
                     <div className="relative group-hover:drop-shadow-[0_0_8px_rgba(66,133,244,0.4)] transition-all scale-90">
                        <GoogleIcon />
                     </div>
                  </button>
                  <button className="relative group transition-transform hover:scale-110 active:scale-95">
                     <div className="absolute -inset-4 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200" />
                     <Github className="relative w-5 h-5 text-text-muted group-hover:text-foreground transition-colors" />
                  </button>
               </div>

               {/* Toggle Link */}
               <div className="mt-10 text-center">
                  <p className="font-body text-sm text-text-secondary">
                     {mode === 'login' ? "Don't have an account?" : "Already have an account?"} 
                     <button 
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-primary font-bold hover:underline ml-1.5"
                     >
                        {mode === 'login' ? 'Sign up for free' : 'Sign in here'}
                     </button>
                  </p>
               </div>
            </motion.div>

            {/* Right Panel: Content Showcase */}
            <motion.div 
               initial={{ x: -480, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.7, delay: 0.1, ease: "circOut" }}
               className="hidden md:flex flex-1 bg-foreground/5 relative overflow-hidden flex flex-col justify-center p-12 md:p-16 border-l border-border/40"
            >
               {/* Decorative Light Glows */}
               <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-40" />
               <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full opacity-30" />
               
               <div className="relative z-10 space-y-12">
                  <div className="space-y-4">
                     <motion.h4 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="font-heading text-4xl text-foreground leading-tight"
                     >
                        Elevate your <br />
                        <span className="text-primary italic">portfolio power.</span>
                     </motion.h4>
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="font-body text-text-secondary text-lg"
                     >
                        Everything you need to master your mutual fund investments in one place.
                     </motion.p>
                  </div>

                  <div className="space-y-8">
                     {FEATURES.map((feature, i) => (
                        <motion.div 
                           key={feature.title}
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: 0.7 + (i * 0.1) }}
                           className="flex items-start gap-5 group"
                        >
                           <div className="mt-1 w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center flex-shrink-0 transition-all group-hover:border-primary/40 group-hover:shadow-[0_4px_12px_rgba(0,229,160,0.1)]">
                              <feature.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                           </div>
                           <div className="space-y-1">
                              <h5 className="font-heading text-foreground text-lg">{feature.title}</h5>
                              <p className="font-body text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>

                  {/* Dynamic Trust Badge with Faces */}
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 1.1 }}
                     className="pt-10 flex items-center gap-4 border-t border-border"
                  >
                     <div className="flex -space-x-4">
                        {[
                          'https://i.pravatar.cc/150?u=1',
                          'https://i.pravatar.cc/150?u=2',
                          'https://i.pravatar.cc/150?u=3',
                          'https://i.pravatar.cc/150?u=4'
                        ].map((src, i) => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-foreground/5 relative overflow-hidden">
                              <img src={src} alt="Investor" className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-300" />
                           </div>
                        ))}
                     </div>
                     <p className="font-body text-xs text-text-secondary">
                        Join <span className="text-foreground font-bold underline decoration-primary/40 underline-offset-4 pointer-events-none">12,000+ investors</span> <br />
                        optimizing their wealth daily.
                     </p>
                  </motion.div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
