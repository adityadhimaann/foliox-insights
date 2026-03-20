import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const words = "Know Exactly How Your Mutual Funds Are Performing".split(" ");

const FloatingCard = () => (
  <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2"
    style={{ perspective: '1000px' }}
  >
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
      whileHover={{ rotateY: -6, rotateX: 2, scale: 1.02 }}
      className="w-[320px] p-5 rounded-[20px]"
      style={{
        background: 'linear-gradient(135deg, rgba(13,25,48,0.9), rgba(15,32,64,0.8))',
        border: '1px solid rgba(0,229,160,0.2)',
        boxShadow: '0 0 0 1px rgba(0,229,160,0.1), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(0,229,160,0.08)',
        backdropFilter: 'blur(20px)',
        transform: 'perspective(1000px) rotateY(-12deg) rotateX(4deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-body text-[11px] text-text-secondary uppercase tracking-wider">Portfolio Health</span>
        <span className="font-mono text-lg text-primary font-medium" style={{ textShadow: '0 0 12px rgba(0,229,160,0.5)' }}>72/100</span>
      </div>
      <div className="h-px bg-primary/20 mb-3" />
      <div className="h-1.5 rounded-full bg-white/5 mb-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #00E5A0, #3B82F6)', width: '72%' }}
          initial={{ width: 0 }}
          animate={{ width: '72%' }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
      <div className="flex justify-between text-center">
        {[
          { label: 'XIRR', value: '11.4%' },
          { label: 'Corpus', value: '₹8L' },
          { label: 'Funds', value: '5' },
        ].map(s => (
          <div key={s.label}>
            <p className="font-mono text-sm text-foreground">{s.value}</p>
            <p className="font-body text-[10px] text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {/* Mini sparkline */}
      <svg className="w-full h-8 mt-3" viewBox="0 0 280 30" fill="none">
        <path d="M0 25 Q30 22 60 20 T120 15 T180 10 T240 8 T280 3" stroke="rgba(0,229,160,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M0 25 Q30 22 60 20 T120 15 T180 10 T240 8 T280 3 V30 H0 Z" fill="url(#sparkGrad)" />
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,229,160,0.15)" />
            <stop offset="100%" stopColor="rgba(0,229,160,0)" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
    {/* Reflection */}
    <div className="w-[320px] mt-2 opacity-[0.08] pointer-events-none"
      style={{
        transform: 'perspective(1000px) rotateY(-12deg) rotateX(4deg) scaleY(-1)',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 60%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 60%)',
        background: 'linear-gradient(135deg, rgba(13,25,48,0.9), rgba(15,32,64,0.8))',
        height: '80px',
        borderRadius: '20px',
      }}
    />
  </div>
);

const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="font-mono text-[28px] md:text-[32px] text-primary font-medium"
      style={{ textShadow: '0 0 20px rgba(0,229,160,0.3)' }}
    >
      {value}{suffix}
    </motion.span>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '90vh' }}>
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-[120px] relative">
        <div className="max-w-[640px]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-primary text-[13px] font-body tracking-[0.08em] uppercase mb-6"
          >
            Powered by AI · Free · Takes 10 seconds
            <span className="inline-block w-[2px] h-4 bg-primary ml-1 align-middle" style={{ animation: 'typing-dots 1s step-end infinite' }} />
          </motion.p>

          <div className="mb-6">
            <h1 className="font-heading text-[40px] md:text-[60px] lg:text-[64px] text-foreground leading-[1.15]">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.04, ease: 'easeOut' }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="font-body text-lg md:text-xl text-text-secondary leading-relaxed mb-10"
          >
            Upload your CAMS or KFintech statement. Get your Portfolio Health Score, true XIRR, fund overlap analysis, and a plain-English rebalancing plan — in under 10 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex flex-col items-start gap-3"
          >
            <button
              onClick={() => navigate('/upload')}
              className="cta-pulse h-14 px-8 rounded-[14px] text-primary-foreground font-body text-[17px] font-medium transition-all duration-150 hover:brightness-110 group"
              style={{
                background: 'linear-gradient(135deg, #00E5A0, #00C48C)',
                boxShadow: '0 4px 20px rgba(0,229,160,0.35)',
              }}
            >
              Upload Your Statement
              <span className="inline-block ml-2 transition-transform duration-150 group-hover:translate-x-1">→</span>
            </button>
            <span className="text-text-muted text-[13px] font-body">
              PDF only · Your data never leaves your session
            </span>
          </motion.div>
        </div>

        <FloatingCard />

        {/* Mobile stat pills */}
        <div className="lg:hidden flex overflow-x-auto gap-3 mt-10 pb-2 -mx-2 px-2 snap-x snap-mandatory">
          {[
            { number: '14 Cr+', label: 'Demat Holders' },
            { number: '₹0', label: 'Cost' },
            { number: '10 Sec', label: 'Analysis' },
          ].map(stat => (
            <div key={stat.label} className="flex-shrink-0 snap-center glass-card !rounded-xl px-5 py-3 text-center min-w-[120px]">
              <AnimatedCounter value={stat.number} />
              <p className="font-body text-[11px] text-text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Desktop stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="hidden lg:flex items-center justify-center gap-0 mt-16 pt-10 border-t border-white/5"
        >
          {[
            { number: '14 Cr+', label: 'Demat Holders in India' },
            { number: '₹0', label: 'Cost' },
            { number: '10 Sec', label: 'Analysis' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && <div className="w-px h-10 bg-white/10 mx-10" />}
              <div className="text-center px-4 py-2 rounded-lg hover:bg-primary-dim transition-colors duration-150">
                <AnimatedCounter value={stat.number} />
                <p className="font-body text-[13px] text-text-muted mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
