import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-10"
      style={{
        background: 'rgba(7,13,26,0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <Link to="/" className="flex items-center gap-3">
        <span className="font-heading text-2xl tracking-tight">
          <span className="text-foreground">Folio</span>
          <span className="logo-pulse-dot" />
          <span className="text-primary" style={{ textShadow: '0 0 20px rgba(0,229,160,0.6)' }}>X</span>
        </span>
        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-body font-medium bg-primary-dim text-primary tracking-wide border border-primary/10">
          ET AI Hackathon 2026
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
