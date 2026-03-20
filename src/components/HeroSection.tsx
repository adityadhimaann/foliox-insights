import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const words = "Know Exactly How Your Mutual Funds Are Performing".split(" ");

const DeviceMockups = () => {
  if (window.self !== window.top) return null;

  return (
    <div className="hidden lg:block absolute right-[1%] xl:right-[5%] top-1/2 -translate-y-1/2 w-[540px] z-10"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="relative"
        style={{
          transform: 'perspective(1200px) rotateY(-12deg) rotateX(4deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Realistic Laptop Mockup (MacBook style) */}
        <div className="relative group/laptop">
          {/* Main Display Frame */}
          <div className="relative rounded-[22px] p-[10px] bg-[#0f0f0f] border border-[#2a2a2a] shadow-2xl overflow-hidden aspect-[16/10] w-[500px] ring-1 ring-white/10 transition-transform duration-300">
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-30"></div>
            
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[18px] bg-black rounded-b-xl z-30 flex items-center justify-center gap-1.5 px-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] border border-white/5"></div>
              <div className="w-1 h-1 rounded-full bg-[#1a1a1a]"></div>
            </div>

            {/* Desktop Website Video */}
            <div className="w-full h-full overflow-hidden rounded-[12px] bg-black relative z-10">
              <video 
                src="/dekstop.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover object-top select-none"
              />
            </div>
          </div>
          
          {/* Macbook Base / Chassis */}
          <div className="relative group">
            {/* Top Surface of Base */}
            <div className="w-[500px] h-[6px] bg-[#d1d5db] dark:bg-[#323232] rounded-t-sm relative shadow-inner">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-black/10 rounded-full"></div>
            </div>
            {/* Front Edge of Base */}
            <div className="w-[500px] h-3 bg-gradient-to-b from-[#b1b5bb] to-[#81858b] dark:from-[#2a2a2a] dark:to-[#1a1a1a] rounded-b-2xl relative flex justify-center shadow-lg border-t border-white/10">
              {/* Thumb Notch */}
              <div className="w-20 h-1.5 bg-[#6b7280] dark:bg-[#0f0f0f] rounded-b-lg opacity-80"></div>
            </div>
            {/* Feet/Shadow under base */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[94%] h-[2px] bg-black/40 blur-[2px] rounded-full"></div>
          </div>
        </div>

        {/* Mobile Mockup overlapping */}
        <motion.div
          className="absolute bottom-20 -right-8 w-[150px] aspect-[9/19.5] rounded-[32px] border-[6px] border-black bg-black shadow-2xl overflow-hidden z-20 ring-1 ring-white/10"
        >
          <div className="w-full h-full overflow-hidden rounded-[26px] bg-black relative">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-[10px] z-10"></div>
            <video 
              src="/mobile.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover select-none"
            />
          </div>
        </motion.div>
        
        {/* Reflection */}
        <div className="w-[500px] mt-2 opacity-[0.08] pointer-events-none"
          style={{
            transform: 'scaleY(-1)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 60%)',
            background: 'hsl(var(--bg-card))',
            height: '100px',
            borderRadius: '20px',
          }}
        />
      </motion.div>
    </div>
  );
};

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
        <div className="max-w-[640px] relative z-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-primary text-[13px] font-body tracking-[0.08em] uppercase mb-6"
          >
            Strong AGENTIC AI · Free · Takes 10 seconds
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

        <DeviceMockups />

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
          className="hidden lg:flex items-center justify-center gap-0 mt-16 pt-10 border-t border-border/40"
        >
          {[
            { number: '14 Cr+', label: 'Demat Holders in India' },
            { number: '₹0', label: 'Cost' },
            { number: '10 Sec', label: 'Analysis' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && <div className="w-px h-10 bg-border/40 mx-10" />}
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
