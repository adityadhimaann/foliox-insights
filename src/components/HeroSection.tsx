import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Users, BadgeDollarSign, Timer, TrendingUp } from 'lucide-react';

const words = "Know Exactly How Your Mutual Funds Are Performing".split(" ");

const DeviceMockups = () => {
  if (window.self !== window.top) return null;

  return (
    <div className="hidden lg:block absolute right-[1%] xl:right-[5%] top-[28%] -translate-y-1/2 w-[560px] z-10">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* === MACBOOK SCREEN LID === */}
        <div className="relative mx-auto" style={{ width: '520px' }}>
          {/* Screen lid - gray bezel */}
          <div 
            className="relative rounded-t-[18px] overflow-hidden"
            style={{
              padding: '10px 10px 0 10px',
              background: 'linear-gradient(180deg, #7a7a80 0%, #6a6a70 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {/* Webcam dot */}
            <div className="absolute top-[3px] left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
              <div className="w-[5px] h-[5px] rounded-full bg-[#606066] ring-1 ring-[#555]" />
            </div>

            {/* Screen content */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-[6px] bg-black">
              <video 
                src="/dekstop.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover select-none"
              />
              {/* Subtle screen glare */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
            </div>
          </div>

          {/* === HINGE === */}
          <div className="relative" style={{ width: '520px' }}>
            <div 
              className="w-full h-[3px]"
              style={{
                background: 'linear-gradient(180deg, #606066 0%, #6a6a70 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
              }}
            />
          </div>

          {/* === MACBOOK BASE / CHASSIS === */}
          <div className="relative mx-auto" style={{ width: '560px' }}>
            <div 
              className="relative overflow-hidden"
              style={{
                height: '14px',
                marginLeft: '-20px',
                marginRight: '-20px',
                width: '560px',
                background: 'linear-gradient(180deg, #707076 0%, #636369 40%, #5a5a60 100%)',
                borderRadius: '0 0 14px 14px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              {/* Trackpad indent notch */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(180deg, #555 0%, #606066 100%)',
                  borderRadius: '0 0 6px 6px',
                }}
              />
              
              {/* Base bottom edge highlight */}
              <div 
                className="absolute bottom-0 left-[10px] right-[10px] h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.1) 80%, transparent)',
                }}
              />
            </div>
          </div>

          {/* === DROP SHADOW === */}
          <div 
            className="mx-auto pointer-events-none"
            style={{
              width: '480px',
              height: '20px',
              marginTop: '4px',
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%)',
              filter: 'blur(6px)',
            }}
          />
        </div>

        {/* Mobile Mockup overlapping */}
        <motion.div
          className="absolute bottom-2 -right-4 w-[140px] aspect-[9/19.5] rounded-[28px] border-[5px] border-[#6a6a70] bg-[#6a6a70] overflow-hidden z-20"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          <div className="w-full h-full overflow-hidden rounded-[23px] bg-black relative">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-[14px] bg-black rounded-[8px] z-10" />
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

const StatsChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chartRef, { once: true, margin: '-60px' });

  const bars = [
    { barH: 75, color: 'linear-gradient(180deg,#00E5A0,#00C48C)', glow: 'rgba(0,229,160,0.35)', pct: '+28.4%', delay: 0.2 },
    { barH: 55, color: 'linear-gradient(180deg,#6b7280,#4b5563)', glow: 'rgba(107,114,128,0.2)',  pct: '₹0',    delay: 0.35 },
    { barH: 68, color: 'linear-gradient(180deg,#00E5A0,#00C48C)', glow: 'rgba(0,229,160,0.35)', pct: '10s',    delay: 0.5  },
  ];

  return (
    <div ref={chartRef} className="hidden lg:block w-full mt-16 pt-10 border-t border-border/40">

      {/* Header row */}
      <motion.div
        className="flex items-center justify-between mb-4 px-2"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="font-heading text-sm font-semibold text-foreground">FolioX Portfolio Performance</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={isInView ? { opacity: [1, 0.2, 1], scale: [1, 1.4, 1] } : { opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="font-mono text-[11px] text-primary font-bold tracking-wider">LIVE</span>
          <span className="font-mono text-[11px] text-text-muted">• NSE</span>
        </div>
      </motion.div>

      {/* Chart area */}
      <div className="relative w-full flex" style={{ height: '240px' }}>

        {/* Y Axis labels */}
        <div className="flex flex-col justify-between items-end pr-3 py-0 select-none" style={{ width: '44px' }}>
          {['100%','75%','50%','25%','0%'].map((l, i) => (
            <motion.span
              key={l}
              className="font-mono text-[10px]"
              style={{ color: 'hsl(var(--border) / 0.7)' }}
              initial={{ opacity: 0, x: -6 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >{l}</motion.span>
          ))}
        </div>

        {/* Chart body */}
        <div className="relative flex-1 flex flex-col">
          <div className="relative flex-1 overflow-hidden">

            {/* Y axis line */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ background: 'hsl(var(--border) / 0.4)', transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
            />

            {/* Grid lines */}
            {[0,25,50,75,100].map((pct, i) => (
              <motion.div
                key={pct}
                className="absolute w-full"
                style={{ top: `${pct}%`, borderTop: '1px dashed hsl(var(--border) / 0.2)' }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
              />
            ))}

            {/* SVG: area + line + dots */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 220">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E5A0" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#00E5A0" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <motion.path
                d="M0,180 C60,170 100,140 160,120 C220,100 260,130 320,110 C380,90 420,60 500,55 C580,50 620,80 680,65 C740,50 780,30 840,40 C900,50 940,70 1000,60 L1000,220 L0,220 Z"
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 1.2 }}
              />
              <motion.path
                d="M0,180 C60,170 100,140 160,120 C220,100 260,130 320,110 C380,90 420,60 500,55 C580,50 620,80 680,65 C740,50 780,30 840,40 C900,50 940,70 1000,60"
                fill="none" stroke="#00E5A0" strokeWidth="2.5"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 2, delay: 0.6, ease: 'easeInOut' }}
              />

              {/* Tooltip at peak */}
              {isInView && (
                <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }}>
                  <rect x="740" y="4" width="96" height="22" rx="4" fill="#00E5A0" />
                  <text x="788" y="19" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#000">▲ +32.4%</text>
                  <line x1="788" y1="26" x2="788" y2="36" stroke="#00E5A0" strokeWidth="1.5" strokeDasharray="3 2" />
                </motion.g>
              )}

              {[[160,120],[320,110],[500,55],[680,65],[840,40]].map(([cx,cy],i) => (
                <motion.circle key={i} cx={cx} cy={cy} r="3.5"
                  fill="#00E5A0"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 0.9, scale: 1 } : {}}
                  transition={{ delay: 1.4 + i * 0.18, duration: 0.35, type: 'spring', stiffness: 300 }}
                  style={{ filter: 'drop-shadow(0 0 4px #00E5A0)' }}
                />
              ))}

              {isInView && (
                <g>
                  <motion.circle cx="1000" cy="60" r="14" fill="none"
                    stroke="#00E5A0" strokeWidth="1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.8, 2.2] }}
                    transition={{ delay: 2.6, duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.circle cx="1000" cy="60" r="6" fill="#00E5A0"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.6, type: 'spring', stiffness: 300 }}
                    style={{ filter: 'drop-shadow(0 0 8px #00E5A0)' }}
                  />
                </g>
              )}
            </svg>

            {/* Three Bars */}
            <div className="absolute inset-0 flex items-end justify-center gap-10" style={{ padding: '0 12%' }}>
              {bars.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative">
                  <motion.span
                    className="absolute font-mono text-[11px] font-bold"
                    style={{ bottom: `calc(${bar.barH}% + 6px)`, color: i === 1 ? '#9ca3af' : '#00E5A0' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: bar.delay + 0.9, duration: 0.4 }}
                  >{bar.pct}</motion.span>
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.1, delay: bar.delay, ease: [0.34, 1.2, 0.64, 1] }}
                    style={{
                      width: '60px', height: `${bar.barH}%`,
                      background: bar.color, transformOrigin: 'bottom',
                      boxShadow: `0 -12px 40px ${bar.glow}`,
                      borderRadius: '6px 6px 0 0',
                    }}
                  />
                </div>
              ))}
            </div>

          </div>

          {/* X axis line */}
          <motion.div
            className="w-full h-px"
            style={{ background: 'hsl(var(--border) / 0.5)', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.05 }}
          />

          {/* X Axis labels */}
          <div className="flex justify-between pt-1.5 px-1 select-none">
            {['Jan','Mar','May','Jul','Sep','Nov','Now'].map((label, i) => (
              <motion.span
                key={label}
                className="font-mono text-[10px] font-medium"
                style={{ color: i === 6 ? '#00E5A0' : 'hsl(var(--border) / 0.7)' }}
                initial={{ opacity: 0, y: 4 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08 }}
              >{label}</motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Stems — Y-axis label (44px) + 12% padding offset to align with bars */}
      <div className="flex justify-center gap-10" style={{ paddingLeft: 'calc(44px + 12%)', paddingRight: '12%' }}>
        {[
          { color: '#00E5A0', delay: 1.2 },
          { color: '#6b7280', delay: 1.35 },
          { color: '#00E5A0', delay: 1.5 },
        ].map((stem, i) => (
          <div key={i} className="flex-1 flex justify-center">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.35, delay: stem.delay, ease: 'easeIn' }}
              style={{ width: '2px', height: '28px', background: stem.color, transformOrigin: 'top', opacity: 0.6 }}
            />
          </div>
        ))}
      </div>

      {/* Stat Cards — same offset as stems */}
      <div className="flex justify-center gap-10" style={{ paddingLeft: 'calc(44px + 12%)', paddingRight: '12%' }}>
        {[
          { number: '14 Cr+', label: 'Demat Holders in India', Icon: Users,           green: true,  delay: 1.3 },
          { number: '₹0',     label: 'Completely Free',         Icon: BadgeDollarSign, green: false, delay: 1.45 },
          { number: '10 Sec', label: 'Instant Analysis',        Icon: Timer,           green: true,  delay: 1.6 },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: stat.delay, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.02 }}
            className="flex-1 flex flex-col items-center gap-3 px-6 py-5 cursor-default group"
            style={{
              background: stat.green ? 'linear-gradient(135deg,#00E5A0,#00C48C)' : '#6b7280',
              borderRadius: 0,
              boxShadow: stat.green ? '0 8px 30px rgba(0,229,160,0.2)' : '0 8px 20px rgba(0,0,0,0.08)',
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{ background: 'rgba(0,0,0,0.12)', borderRadius: 0 }}
            >
              <stat.Icon className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            <div className="text-center">
              <motion.span
                className="font-mono text-[26px] font-bold text-white block leading-none"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: stat.delay + 0.3 }}
              >{stat.number}</motion.span>
              <p className="font-body text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
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
            { number: '14 Cr+', label: 'Demat Holders', Icon: Users },
            { number: '₹0', label: 'Cost', Icon: BadgeDollarSign },
            { number: '10 Sec', label: 'Analysis', Icon: Timer },
          ].map(stat => (
            <div key={stat.label} className="flex-shrink-0 snap-center px-5 py-4 text-center min-w-[130px] rounded-2xl bg-foreground/[0.03] border border-border/50 backdrop-blur-sm">
              <stat.Icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <AnimatedCounter value={stat.number} />
              <p className="font-body text-[11px] text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <StatsChart />
      </div>
    </section>
  );
};

export default HeroSection;
