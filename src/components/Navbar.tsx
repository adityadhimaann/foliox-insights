import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { openLogin, isLoggedIn, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm transition-colors duration-200">
      <Link to="/" className="flex items-center gap-3">
        <span className="font-heading text-2xl tracking-tight">
          <span className="text-foreground">Folio</span>
          <span className="text-primary" style={{ textShadow: '0 0 20px rgba(0,229,160,0.6)' }}>X</span>
        </span>
      </Link>
      <div className="flex items-center gap-4 md:gap-10">
        <a href="#how-it-works" className="hidden lg:inline text-text-muted hover:text-foreground font-body text-sm font-medium transition-colors duration-200">
          Product
        </a>
        
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-text-muted hover:text-foreground font-body text-sm font-semibold transition-colors duration-200 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                   <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden sm:inline">{user?.username}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background border-border/40 backdrop-blur-xl">
              <DropdownMenuItem 
                onClick={() => navigate('/settings')}
                className="focus:bg-primary/5 cursor-pointer flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                   <User className="w-3.5 h-3.5 text-primary" />
                </div>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center">
                   <LogOut className="w-3.5 h-3.5" />
                </div>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
