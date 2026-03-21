import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, TrendingUp, Grid3X3, BarChart3, 
  Sparkles, Check, Calculator, ShieldAlert, Cpu
} from 'lucide-react';

const steps = [
  { label: 'Reading your statement...', icon: FileText },
  { label: 'Calculating your returns (XIRR)...', icon: TrendingUp },
  { label: 'Comparing to Nifty benchmark...', icon: BarChart3 },
  { label: 'Checking fund overlap...', icon: Grid3X3 },
  { label: 'Calculating expense drag...', icon: Calculator },
  { label: 'Computing health score...', icon: ShieldAlert },
  { label: 'Generating AI action plan...', icon: Cpu },
  { label: 'Finalizing your report...', icon: Sparkles },
];

const facts = [
  'Did you know? The average Indian investor loses 0.9% annually to fund overlap.',
  'Regular plan expense ratios are 0.7-1.2% higher than direct mutual funds.',
  'Over 60% of large-cap funds underperform the Nifty 50 index over 5 years.',
  'Tax-saving ELSS funds have the shortest lock-in period of just 3 years.',
];

interface AnalyzingStepperProps {
  sessionId: string;
  onComplete: (data: any) => void;
  onError: (error: string) => void;
}

const AnalyzingStepper = ({ sessionId, onComplete, onError }: AnalyzingStepperProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Initializing analysis...');
  const [factIndex, setFactIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!sessionId) return;

    const eventSource = new EventSource(`http://localhost:8000/api/stream/${sessionId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.error) {
          eventSource.close();
          onError(data.message);
          return;
        }

        // Update progress driven by backend
        if (data.step) {
          setActiveStep(data.step - 1); // backend is 1-indexed
          setProgressPercent(data.percent || 0);
          setCurrentMessage(data.message);
        }

        // Final completion check
        if (data.complete) {
          eventSource.close();
          // Short delay for the "100%" animation to feel good
          setTimeout(() => onComplete(data.result), 800);
        }
      } catch (err) {
        console.error("Failed to parse SSE event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
      onError("Lost connection to server. Please try again.");
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId, onComplete, onError]);

  useEffect(() => {
    const interval = setInterval(() => setFactIndex(i => (i + 1) % facts.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = activeStep < steps.length ? steps[activeStep].icon : Sparkles;

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-6">
      <div className="noise-overlay" />
      <div className="max-w-md w-full relative z-2">
        {/* Animated rings */}
        <div className="flex justify-center mb-10">
          <div className="relative w-[110px] h-[110px]">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
              style={{ animation: 'spin-ring 6s linear infinite' }}
            />
            <div className="absolute inset-5 rounded-full bg-primary-dim flex items-center justify-center"
              style={{ boxShadow: '0 0 60px rgba(0,229,160,0.15)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ActiveIcon className="w-7 h-7 text-primary" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ animation: 'typing-dots 2s ease-in-out infinite', boxShadow: '0 0 40px rgba(0,229,160,0.05)' }}
            />
          </div>
        </div>

        {/* Step list (last 3 recent steps for focus) */}
        <div className="space-y-3 mb-8">
          {steps.map((step, i) => {
            const isComplete = i < activeStep;
            const isActive = i === activeStep;
            
            // Only show relevant steps to keep it clean (previous, current, and future)
            if (i < activeStep - 1 || i > activeStep + 1) {
              if (i !== 0 && i !== steps.length - 1) return null;
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 py-1 ${
                  isComplete ? 'text-primary/60' : isActive ? 'text-foreground' : 'text-text-muted/40'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {isComplete ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 8px rgba(0,229,160,0.6)' }} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-text-muted/20" />
                  )}
                </div>
                <span className={`font-body text-[14px] ${isComplete ? 'line-through' : ''}`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-[2px] rounded-full overflow-hidden mb-5 relative bg-foreground/5">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00E5A0, #3B82F6)' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="font-body text-[14px] text-text-secondary text-center mb-10 h-6">
          {currentMessage}
        </p>

        {/* Rotating facts */}
        <div className="bg-foreground/[0.02] border border-foreground/[0.05] rounded-xl p-4 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-body text-[12px] text-text-muted italic text-center"
            >
              {facts[factIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AnalyzingStepper;
