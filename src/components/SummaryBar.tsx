import { motion } from 'framer-motion';
import { Download, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ScoreRing = ({ score }: { score: number }) => {
  const size = 90;
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
        <span className="font-mono text-2xl font-bold text-primary leading-none"
          style={{ textShadow: '0 0 15px rgba(0,229,160,0.4)' }}
        >{score}</span>
        <span className="font-mono text-[9px] text-text-muted mt-0.5 font-bold uppercase tracking-tighter">Score</span>
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
      const response = await fetch('http://localhost:8000/api/report/generate-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis)
      });
      
      if (!response.ok) throw new Error("Generation failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Try to get filename from headers, otherwise fallback
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
      className="w-full border-b border-border/40 print:hidden sticky top-0 z-50 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(0,229,160,0.1), transparent 100%), var(--bg-card)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="mx-auto px-6 md:px-10 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-6">
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
             <p className="font-mono text-base md:text-xl font-bold text-foreground">₹5,97,000</p>
             <p className="font-body text-[10px] text-text-muted mt-0.5">6 years</p>
          </div>
          <div className="px-4 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex flex-col items-start min-w-[120px]">
             <p className="font-body text-[10px] text-text-muted mb-0.5">Current value</p>
             <p className="font-mono text-base md:text-xl font-bold text-foreground">₹10,24,255</p>
             <p className="font-body text-[10px] text-text-muted mt-0.5">as of 31 Mar 2026</p>
          </div>
          <div className="px-4 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex flex-col items-start min-w-[120px] bg-primary/10 border-primary/20">
             <p className="font-body text-[10px] text-text-muted mb-0.5">Total gain</p>
             <p className="font-mono text-base md:text-xl font-bold text-primary">+₹4,27,255</p>
             <p className="font-body text-[10px] text-primary/80 mt-0.5">+71.6% absolute</p>
          </div>
          <div className="px-4 py-1.5 rounded-lg border border-border/40 bg-foreground/5 flex flex-col items-start min-w-[120px]">
             <p className="font-body text-[10px] text-text-muted mb-0.5">Portfolio XIRR</p>
             <p className="font-mono text-base md:text-xl font-bold text-primary">11.42%</p>
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
    </motion.div>
  );
};

export default SummaryBar;
