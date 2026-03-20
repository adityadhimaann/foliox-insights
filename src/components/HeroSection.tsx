import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-bg-dark hero-grid-pattern">
      <div className="max-w-[720px] mx-auto px-6 py-24 md:py-[120px] text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-accent text-[13px] font-body tracking-[0.08em] uppercase mb-6"
        >
          Powered by AI · Free · Takes 10 seconds
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
          className="font-heading text-[40px] md:text-[64px] text-primary-foreground leading-[1.15] mb-6"
        >
          Know Exactly How Your Mutual Funds Are Performing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="font-body text-lg md:text-xl text-text-muted leading-relaxed mb-10 max-w-[640px] mx-auto"
        >
          Upload your CAMS or KFintech statement. Get your Portfolio Health Score, true XIRR, fund overlap analysis, and a plain-English rebalancing plan — in under 10 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="flex flex-col items-center gap-3"
        >
          <button
            onClick={() => navigate('/upload')}
            className="h-14 px-8 rounded-[14px] bg-accent text-accent-foreground font-body text-[17px] font-medium shadow-lg shadow-accent/20 transition-all duration-150 hover:brightness-110 hover:shadow-xl hover:shadow-accent/25"
          >
            Upload Your Statement →
          </button>
          <span className="text-text-muted text-[13px] font-body">
            PDF only · Your data never leaves your session
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.24 }}
          className="flex flex-wrap justify-center gap-10 md:gap-[40px] pt-12 mt-4 border-t border-white/5"
        >
          {[
            { number: '14 Cr+', label: 'Demat Holders in India' },
            { number: '₹0', label: 'Cost' },
            { number: '10 Sec', label: 'Analysis' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-[28px] md:text-[32px] text-accent font-medium">{stat.number}</p>
              <p className="font-body text-[13px] text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
