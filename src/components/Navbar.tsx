import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-bg-dark/95 backdrop-blur-sm border-b border-white/5">
      <Link to="/" className="flex items-center gap-3">
        <span className="font-heading text-2xl text-primary-foreground tracking-tight">FolioX</span>
        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-body font-medium bg-accent/15 text-accent tracking-wide">
          ET AI Hackathon 2026
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <a href="#how-it-works" className="hidden md:inline text-text-muted hover:text-primary-foreground font-body text-sm transition-colors duration-150">
          How it works
        </a>
        <button
          onClick={() => navigate('/upload')}
          className="h-10 px-5 rounded-[16px] bg-accent text-accent-foreground font-body text-sm font-medium transition-all duration-150 hover:brightness-110"
        >
          Try Free
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
