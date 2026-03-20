import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Grid3X3, BarChart3, Sparkles, Check, Loader2 } from 'lucide-react';

const steps = [
  { label: 'Reading your statement...', icon: FileText },
  { label: 'Calculating your XIRR...', icon: TrendingUp },
  { label: 'Checking fund overlap...', icon: Grid3X3 },
  { label: 'Comparing to benchmarks...', icon: BarChart3 },
  { label: 'Generating your health score...', icon: Sparkles },
];

interface AnalyzingStepperProps {
  onComplete: () => void;
}

const AnalyzingStepper = ({ onComplete }: AnalyzingStepperProps) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep < steps.length) {
      const timer = setTimeout(() => setActiveStep(prev => prev + 1), 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [activeStep, onComplete]);

  const progress = (activeStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="space-y-4 mb-8">
          {steps.map((step, i) => {
            const isComplete = i < activeStep;
            const isActive = i === activeStep;
            const Icon = step.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 py-2 transition-colors duration-300 ${
                  isComplete ? 'text-accent' : isActive ? 'text-primary' : 'text-text-muted'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {isComplete ? (
                    <Check className="w-5 h-5 text-accent" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-text-muted/40" />
                  )}
                </div>
                <Icon className="w-5 h-5" />
                <span className="font-body text-[15px]">{step.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-border overflow-hidden mb-6">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <p className="font-body text-[15px] text-text-secondary text-center">
          Analysing 47 transactions across 5 funds
        </p>
      </div>
    </div>
  );
};

export default AnalyzingStepper;
