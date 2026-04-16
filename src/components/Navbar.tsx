import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Activity, Menu, X, LayoutDashboard, Upload, Settings, PieChart } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin, isLoggedIn, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileNavItems = isLoggedIn
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Upload Statement', path: '/upload', icon: Upload },
        { label: 'Results', path: '/results', icon: PieChart },
        { label: 'Settings', path: '/settings', icon: Settings },
      ]
    : [];

  return (
    <>
      <nav className="sticky top-0 z-50 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 md:px-10 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm transition-colors duration-200">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-heading text-xl sm:text-2xl tracking-tight">
            <span className="text-foreground">Folio</span>
            <span className="text-primary" style={{ textShadow: '0 0 20px rgba(0,229,160,0.6)' }}>X</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-4 md:gap-8">
          {location.pathname === '/' && (
            <a href="#how-it-works" className="hidden lg:inline text-text-muted hover:text-foreground font-body text-sm font-medium transition-colors duration-200">
              Product
            </a>
          )}
          
          {isLoggedIn ? (
            <>
              <Link 
                to="/dashboard" 
                className={`hidden lg:inline font-body text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-text-muted hover:text-foreground'
                }`}
              >
                Dashboard
              </Link>

              {/* Desktop user dropdown */}
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 text-text-muted hover:text-foreground font-body text-sm font-semibold transition-colors duration-200 focus:outline-none group">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                         <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline">{user?.username}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background border-border/40 shadow-2xl backdrop-blur-xl p-2 rounded-xl">
                    <DropdownMenuItem 
                      onClick={() => navigate('/dashboard')}
                      className="focus:bg-primary/5 cursor-pointer flex items-center gap-3 p-2.5 rounded-lg mb-1"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                         <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-heading">Dashboard</span>
                        <span className="text-[10px] text-text-muted">Activities & Overview</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/settings')}
                      className="focus:bg-primary/5 cursor-pointer flex items-center gap-3 p-2.5 rounded-lg mb-1"
                    >
                      <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center">
                         <User className="w-4 h-4 text-text-muted" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-heading">Profile Settings</span>
                        <span className="text-[10px] text-text-muted">Account Preferences</span>
                      </div>
                    </DropdownMenuItem>
                    <div className="h-px bg-border/40 my-1.5 mx-2" />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer flex items-center gap-3 p-2.5 rounded-lg"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                         <LogOut className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold font-heading">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors text-text-muted"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <button
              onClick={openLogin}
              className="px-4 sm:px-6 py-2 rounded-full bg-primary text-secondary font-body text-sm font-bold hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95"
            >
              Try Free
            </button>
          )}
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileMenuOpen && isLoggedIn && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25,0.1,0.25,1] }}
            className="sm:hidden sticky top-14 z-[49] overflow-hidden border-b border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="p-3 space-y-1">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-body text-sm ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-secondary hover:bg-foreground/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-border/40 my-2 mx-4" />
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-body text-sm text-foreground font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 rounded-lg text-red-500 bg-red-50 text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
