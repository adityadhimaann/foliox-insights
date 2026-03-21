import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, User } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Branding */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-10 group">
          <span className="font-heading text-3xl tracking-tight">
            <span className="text-foreground">Folio</span>
            <span className="text-primary italic">X</span>
          </span>
        </Link>

        {/* Auth Card */}
        <div className="glass-card p-10 bg-background/60 backdrop-blur-3xl border-border shadow-2xl relative">
           <div className="text-center mb-10">
              <h1 className="font-heading text-3xl text-foreground mb-3">Create Account</h1>
              <p className="font-body text-text-secondary">Start your automated wealth journey today</p>
           </div>

           <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/upload'); }}>
              <div className="space-y-4">
                 <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-foreground/5 border border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-body text-foreground"
                      required
                    />
                 </div>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-foreground/5 border border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-body text-foreground"
                      required
                    />
                 </div>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                      type="password" 
                      placeholder="Create Password" 
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-foreground/5 border border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-body text-foreground"
                      required
                    />
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-heading text-lg font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                Create Account <ArrowRight className="w-5 h-5" />
              </button>
           </form>

           {/* Divider */}
           <div className="flex items-center gap-4 my-10">
              <div className="h-px bg-border flex-1" />
              <span className="font-body text-[10px] text-text-muted uppercase tracking-widest font-bold">Or sign up with</span>
              <div className="h-px bg-border flex-1" />
           </div>

           {/* Social Logins */}
           <div className="grid grid-cols-2 gap-4">
              <button className="h-12 rounded-xl bg-foreground/5 border border-border flex items-center justify-center gap-3 hover:bg-foreground/10 transition-colors font-body text-sm text-foreground">
                 <GoogleIcon /> Google
              </button>
              <button className="h-12 rounded-xl bg-foreground/5 border border-border flex items-center justify-center gap-3 hover:bg-foreground/10 transition-colors font-body text-sm text-foreground">
                 <Github className="w-4 h-4" /> GitHub
              </button>
           </div>

           {/* Footer Link */}
           <div className="mt-10 pt-8 border-t border-border text-center">
              <p className="font-body text-sm text-text-secondary">
                 Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
