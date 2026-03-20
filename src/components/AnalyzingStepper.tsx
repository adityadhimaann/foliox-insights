import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, TrendingUp, Grid3X3, BarChart3, Sparkles, Check } from 'lucide-react';

const steps = [
  { label: 'Reading your statement...', icon: FileText },
  { label: 'Calculating your XIRR...', icon: TrendingUp },
  { label: 'Checking fund overlap...', icon: Grid3X3 },
  { label: 'Comparing to benchmarks...', icon: BarChart3 },
  { label: 'Generating your health score...', icon: Sparkles },
];

const facts = [
  'Did you know? The average Indian investor loses 0.9% annually to fund overlap alone.',
  'Regular plan expense ratios are 0.5–1% higher than direct plans.',
  'Over 60% of large-cap funds underperform the Nifty 50 index.',
  'SIP investments have grown 5x in India since 2016.',
];

interface AnalyzingStepperProps {
  onComplete: () => void;
}

const AnalyzingStepper = ({ onComplete }: AnalyzingStepperProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  const stableOnComplete = useCallback(onComplete, []);

  useEffect(() => {
    if (activeStep < steps.length) {
      const timer = setTimeout(() => setActiveStep(prev => prev + 1), 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(stableOnComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [activeStep, stableOnComplete]);

  useEffect(() => {
    const interval = setInterval(() => setFactIndex(i => (i + 1) % facts.length), 3000);
    return () => clearInterval(interval);
  }, []);

  const progress = (activeStep / steps.length) * 100;
  const ActiveIcon = activeStep < steps.length ? steps[activeStep].icon : Sparkles;

  return (
    <div className="page-bg flex items-center justify-center px-6">
      <div className="noise-overlay" />
      <div className="max-w-md w-full relative z-2">
        {/* Animated rings */}
        <div className="flex justify-center mb-10">
          <div className="relative w-[120px] h-[120px]">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
              style={{ animation: 'spin-ring 3s linear infinite' }}
            />
            {/* Middle ring */}
            <div className="absolute inset-3 rounded-full border border-accent-blue/30"
              style={{ animation: 'spin-ring-reverse 2s linear infinite' }}
            />
            {/* Inner circle */}
            <div className="absolute inset-6 rounded-full bg-primary-dim flex items-center justify-center"
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
                  <ActiveIcon className="w-8 h-8 text-primary" />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Pulse glow */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ animation: 'typing-dots 2s ease-in-out infinite', boxShadow: '0 0 60px rgba(0,229,160,0.1)' }}
            />
          </div>
        </div>

        {/* Step list */}
        <div className="space-y-3 mb-8">
          {steps.map((step, i) => {
            const isComplete = i < activeStep;
            const isActive = i === activeStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-3 py-1.5 transition-colors duration-300 ${
                  isComplete ? 'text-primary' : isActive ? 'text-foreground' : 'text-text-muted'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {isComplete ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : isActive ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" style={{ boxShadow: '0 0 8px rgba(0,229,160,0.6)' }} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-text-muted/30" />
                  )}
                </div>
                <span className={`font-body text-[15px] ${isComplete ? 'line-through text-text-muted' : ''}`}>
                  {step.label}
                </span>
                {isActive && (
                  <span className="flex gap-0.5 ml-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-[3px] rounded-full overflow-hidden mb-6 relative" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, #00E5A0, #3B82F6)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                width: '40px',
                animation: 'progress-highlight 1s linear infinite',
              }}
            />
          </motion.div>
        </div>

        <p className="font-body text-[15px] text-text-secondary text-center mb-6">
          Analysing 47 transactions across 5 funds
        </p>

        {/* Rotating facts */}
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-body text-[13px] text-text-muted italic text-center max-w-[400px] mx-auto"
          >
            {facts[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyzingStepper;
