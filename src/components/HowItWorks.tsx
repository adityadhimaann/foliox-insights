import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, BrainCircuit, ShieldCheck, ChevronRight } from 'lucide-react';

const steps = [
  { 
    number: '01', 
    title: 'Secure Upload', 
    tagline: '2-Minute Export',
    description: 'Export your CAS PDF from CAMS or KFintech. Our SOC-2 compliant reader handles your data with absolute privacy.', 
    icon: Upload,
    color: 'rgb(0, 229, 160)'
  },
  { 
    number: '02', 
    title: 'Deep AI Diagnostic', 
    tagline: '1,000+ Metrics Tracked',
    description: 'Our proprietary models analyze every transaction to reveal your real XIRR, fund overlap, and hidden expenses.', 
    icon: BrainCircuit,
    color: 'rgb(59, 130, 246)'
  },
  { 
    number: '03', 
    title: 'Wealth Roadmap', 
    tagline: 'Actionable Insights',
    description: 'Receive a personalized rebalancing plan in plain English/Hindi with a clear 0-100 Portfolio Health Score.', 
    icon: ShieldCheck,
    color: 'rgb(139, 92, 246)'
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden bg-background">
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.4] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border text-foreground/60 text-[11px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            The Protocol
          </motion.div>
          
          <h2 className="font-heading text-5xl md:text-6xl text-foreground tracking-tight mb-8">
            From data to <span className="text-primary italic">intelligence</span>
          </h2>
          
          <p className="font-body text-xl text-text-secondary max-w-3xl leading-relaxed">
            FolioX transforms raw financial statements into a strategic advantage. 
            The entire process is automated, secure, and completed in seconds.
          </p>
        </div>

        <div className="relative">
          {/* Animated Curved Path (Desktop Only) */}
          <svg className="hidden xl:block absolute top-[120px] left-[15%] right-[15%] w-[70%] h-[100px] pointer-events-none overflow-visible" viewBox="0 0 800 100">
             <path d="M0,50 Q400,0 800,50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="text-border/40" />
             <motion.path 
                d="M0,50 Q400,0 800,50" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="2" 
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
             />
          </svg>

          <div className="grid md:grid-cols-3 gap-12 xl:gap-20">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Process Step UI */}
                <div className="mb-10 relative">
                   <div className="w-[124px] h-[124px] rounded-full bg-background border-2 border-border flex items-center justify-center relative z-20 transition-all duration-500 group-hover:border-primary group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(0,229,160,0.2)]">
                      <step.icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                      
                      {/* Number Badge floating */}
                      <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-foreground text-background font-mono text-sm font-bold flex items-center justify-center border-4 border-background shadow-lg">
                         {step.number}
                      </div>
                   </div>
                   {/* Radial Under-glow */}
                   <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-md bg-foreground/5 text-primary text-[10px] font-bold uppercase tracking-wider">
                     {step.tagline}
                  </div>
                  <h3 className="font-heading text-3xl text-foreground font-medium group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="font-body text-text-secondary text-base leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                  <div className="pt-4 flex items-center justify-center gap-1.5 text-primary font-body text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                     Learn the Tech <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default HowItWorks;
