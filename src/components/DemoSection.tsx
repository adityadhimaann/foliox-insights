import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Play, Sparkles } from 'lucide-react';

const DemoSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [0.4, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={containerRef} className="pt-24 pb-0 px-6 md:px-10 relative overflow-hidden bg-background">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Live Product Demo
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl text-foreground mb-6"
          >
            See FolioX in <span className="text-primary italic">Action</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-text-secondary max-w-2xl"
          >
            Experience how our AI reads your portfolio and generates actionable insights in seconds. 
            No complex setups, just pure financial intelligence.
          </motion.p>
        </div>

        {/* Video Player Container */}
        <motion.div
          style={{ scale, opacity }}
          className="relative max-w-5xl mx-auto group"
        >
          {/* Glowing Border Effect */}
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-[32px] blur-sm opacity-50 transition-opacity duration-500" />
          
          {/* Main Video Box */}
          <div className="relative rounded-[32px] overflow-hidden bg-background/60 backdrop-blur-2xl border-2 border-gray-400/70 shadow-2xl aspect-video"
            style={{ 
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.05),
                0 25px 60px -12px rgba(0,0,0,0.25)
              `
            }}
          >
            <video 
              src="/dekstop.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-contain p-4 bg-black/5 rounded-[32px]"
            />
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-transparent z-10 opacity-30" />
          </div>
          

        </motion.div>

        {/* Walkthrough Titles (Now centered below the container) */}
        <div className="flex flex-col items-center mt-12 text-center">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                 <Play className="w-4 h-4 text-primary fill-primary" />
              </div>
              <h4 className="font-heading text-foreground text-2xl font-medium tracking-tight">FolioX Product Walkthrough</h4>
           </div>
           <p className="font-body text-text-secondary text-lg max-w-xl">
             Real-time analysis feature showcase
           </p>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
