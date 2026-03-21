import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Retail Investor, Mumbai',
    avatar: 'PS',
    color: '#00E5A0',
    rating: 5,
    text: 'FolioX showed me that 3 of my mutual funds had 78% overlap. I was essentially paying double expense ratios for the same stocks. Saved ₹12,000/year!',
  },
  {
    name: 'Rahul Mehta',
    role: 'CA & Financial Planner',
    avatar: 'RM',
    color: '#3B82F6',
    rating: 5,
    text: 'I recommend FolioX to all my clients. The Portfolio Health Score gives them a clear, actionable picture. The rebalancing plan in Hindi is a huge plus.',
  },
  {
    name: 'Ananya Reddy',
    role: 'Software Engineer, Bengaluru',
    avatar: 'AR',
    color: '#8B5CF6',
    rating: 5,
    text: 'Uploaded my CAMS statement and got a full breakdown in 8 seconds. My real XIRR was 4% lower than what my app showed. Eye-opening.',
  },
  {
    name: 'Vikram Singh',
    role: 'Retired Professor, Delhi',
    avatar: 'VS',
    color: '#F59E0B',
    rating: 5,
    text: 'At 62, I needed clarity on my retirement corpus. FolioX not only analyzed my portfolio but gave me a simple roadmap I could actually follow.',
  },
];

const Testimonials = () => {
  return (
    <section className="pt-0 pb-24 px-6 md:px-10 relative overflow-hidden bg-background">
      {/* Subtle background accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border text-foreground/60 text-[11px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Quote className="w-3 h-3" />
            Wall of Love
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl text-foreground tracking-tight mb-6"
          >
            Trusted by <span className="text-primary italic">thousands</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-text-secondary max-w-2xl"
          >
            Real stories from real investors who transformed their portfolio strategy with FolioX.
          </motion.p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 rounded-[24px] bg-foreground/[0.02] border border-border/60 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,229,160,0.06)]"
            >
              {/* Quote icon */}
              <div
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{ background: t.color }}
              >
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="font-body text-[16px] text-foreground/80 leading-relaxed mb-8">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-heading text-sm font-bold shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="font-body text-[13px] text-text-muted">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
