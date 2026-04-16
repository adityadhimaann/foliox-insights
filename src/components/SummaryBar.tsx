import { motion } from 'framer-motion';
import { Download, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE } from '@/lib/api';

const ScoreRing = ({ score, size = 90 }: { score: number; size?: number }) => {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="flex-shrink-0">
        <defs>
          <linearGradient id="miniRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5A0" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" className="text-foreground/10" strokeWidth={stroke} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#miniRingGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-lg sm:text-2xl font-bold text-primary leading-none"
          style={{ textShadow: '0 0 15px rgba(0,229,160,0.4)' }}
        >{score}</span>
        <span className="font-mono text-[8px] sm:text-[9px] text-text-muted mt-0.5 font-bold uppercase tracking-tighter">Score</span>
      </div>
    </div>
  );
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

interface SummaryBarProps {
  analysis: any;
}

const SummaryBar = ({ analysis }: SummaryBarProps) => {
  const score = Math.round(analysis.health_score.total_score);

  const handleDownload = async () => {
    const toastId = toast.loading("Generating your comprehensive portfolio report...");
    
    try {
      const response = await fetch(`${API_BASE}/api/report/generate-custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis)
      });
      
      if (!response.ok) throw new Error("Generation failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `FolioX_Report_${new Date().getTime()}.pdf`;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success("Report downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report. Make sure backend is running.", { id: toastId });
    }
  };

  const handleShare = () => {
    const shareData = {
      title: 'FolioX Portfolio Analysis',
      text: `My Portfolio Health Score: ${score}/100 | XIRR: ${(analysis.total_xirr * 100).toFixed(2)}%. Check yours on FolioX!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        toast.error("Sharing cancelled");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-border/40 print:hidden sticky top-0 z-50"
      style={{
        background: 'linear-gradient(180deg, rgba(0,229,160,0.1), transparent 100%), var(--bg-card)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="mx-auto px-4 sm:px-6 md:px-10 py-3 md:py-4">
        {/* Mobile layout: compact row */}
        <div className="flex items-center justify-between gap-3 sm:hidden">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1.5 rounded-full border border-border/40 text-text-muted hover:text-foreground transition-all bg-background/40">
               <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <ScoreRing score={score} size={60} />
            <div>
              <p className="font-mono text-sm font-bold text-primary">{(analysis.total_xirr * 100).toFixed(1)}% XIRR</p>
              <p className="font-body text-[10px] text-text-muted">Value: {formatCurrency(analysis.total_current_value)}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={handleDownload}
              className="h-8 w-8 rounded-lg border border-border/40 text-foreground flex items-center justify-center transition-all hover:bg-foreground/5 bg-background/20"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleShare}
              className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center transition-all hover:brightness-110 shadow-lg shadow-primary/20"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile: scrollable stat pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar sm:hidden pb-1 -mx-1 px-1">
          <div className="px-3 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex-shrink-0 min-w-[100px]">
             <p className="font-body text-[9px] text-text-muted">Invested</p>
             <p className="font-mono text-sm font-bold text-foreground">{formatCurrency(analysis.total_investment || analysis.total_invested)}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex-shrink-0 min-w-[100px]">
             <p className="font-body text-[9px] text-text-muted">Current</p>
             <p className="font-mono text-sm font-bold text-foreground">{formatCurrency(analysis.total_current_value)}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 flex-shrink-0 min-w-[100px]">
             <p className="font-body text-[9px] text-text-muted">Gain</p>
             <p className="font-mono text-sm font-bold text-primary">
                {analysis.total_current_value - (analysis.total_investment || analysis.total_invested) >= 0 ? '+' : ''}
                {formatCurrency(analysis.total_current_value - (analysis.total_investment || analysis.total_invested))}
             </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex-shrink-0 min-w-[80px]">
             <p className="font-body text-[9px] text-text-muted">XIRR</p>
             <p className="font-mono text-sm font-bold text-primary">{(analysis.total_xirr * 100).toFixed(2)}%</p>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="p-2 rounded-full border border-border/40 text-text-muted hover:text-foreground transition-all hover:bg-foreground/5 bg-background/40">
               <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-4">
              <ScoreRing score={score} />
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 flex-wrap">
            <div className="px-4 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex flex-col items-start min-w-[120px]">
               <p className="font-body text-[10px] text-text-muted mb-0.5">Total invested</p>
               <p className="font-mono text-base md:text-xl font-bold text-foreground">{formatCurrency(analysis.total_investment || analysis.total_invested)}</p>
               <p className="font-body text-[10px] text-text-muted mt-0.5">Portfolio Life</p>
            </div>
            <div className="px-4 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex flex-col items-start min-w-[120px]">
               <p className="font-body text-[10px] text-text-muted mb-0.5">Current value</p>
               <p className="font-mono text-base md:text-xl font-bold text-foreground">{formatCurrency(analysis.total_current_value)}</p>
               <p className="font-body text-[10px] text-text-muted mt-0.5">as of {analysis.analysis_timestamp || 'today'}</p>
            </div>
            <div className="px-4 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex flex-col items-start min-w-[120px] bg-primary/10 border-primary/20">
               <p className="font-body text-[10px] text-text-muted mb-0.5">Total gain</p>
               <p className="font-mono text-base md:text-xl font-bold text-primary">
                  {analysis.total_current_value - (analysis.total_investment || analysis.total_invested) >= 0 ? '+' : ''}
                  {formatCurrency(analysis.total_current_value - (analysis.total_investment || analysis.total_invested))}
               </p>
               <p className="font-body text-[10px] text-primary/80 mt-0.5">
                  {(((analysis.total_current_value / (analysis.total_investment || analysis.total_invested)) - 1) * 100).toFixed(1)}% absolute
               </p>
            </div>
            <div className="px-4 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex flex-col items-start min-w-[120px]">
               <p className="font-body text-[10px] text-text-muted mb-0.5">Portfolio XIRR</p>
               <p className="font-mono text-base md:text-xl font-bold text-primary">
                  {(analysis.total_xirr * 100).toFixed(2)}%
               </p>
               <p className="font-body text-[10px] text-text-muted mt-0.5">per annum</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleDownload}
              className="h-9 px-3 rounded-lg border border-border-glow text-foreground font-body text-xs flex items-center gap-2 transition-all duration-150 hover:bg-foreground/5 bg-background/20"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <Download className="w-3.5 h-3.5" /> Reports
            </button>
            <button 
              onClick={handleShare}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-body text-[13px] font-bold flex items-center gap-2 transition-all duration-150 hover:brightness-110 shadow-lg shadow-primary/20"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryBar;
