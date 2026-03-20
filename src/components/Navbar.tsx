import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm transition-colors duration-200">
      <Link to="/" className="flex items-center gap-3">
        <span className="font-heading text-2xl tracking-tight">
          <span className="text-foreground">Folio</span>
          <span className="logo-pulse-dot" />
          <span className="text-primary" style={{ textShadow: '0 0 20px rgba(0,229,160,0.6)' }}>X</span>
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <a href="#how-it-works" className="hidden md:inline text-text-muted hover:text-foreground font-body text-sm transition-colors duration-150">
          How it works
        </a>
        <button
          onClick={() => navigate('/upload')}
          className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium transition-all duration-150 hover:brightness-110"
          style={{ boxShadow: '0 0 20px rgba(0,229,160,0.2)' }}
        >
          Try Free
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
