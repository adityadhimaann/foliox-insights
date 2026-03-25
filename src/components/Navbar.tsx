import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Activity } from 'lucide-react';
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

  return (
    <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm transition-colors duration-200">
      <Link to="/" className="flex items-center gap-3">
        <span className="font-heading text-2xl tracking-tight">
          <span className="text-foreground">Folio</span>
          <span className="text-primary" style={{ textShadow: '0 0 20px rgba(0,229,160,0.6)' }}>X</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-4 md:gap-8">
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
          </>
        ) : (
          <button
            onClick={openLogin}
            className="px-6 py-2 rounded-full bg-primary text-secondary font-body text-sm font-bold hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95"
          >
            Try Free
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
