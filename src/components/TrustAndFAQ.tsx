import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Shield, Zap, TrendingUp, Users, ChevronDown } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '12,000+',
    label: 'Active Users',
    description: 'Investors analyzing portfolios weekly',
  },
  {
    icon: TrendingUp,
    value: '₹2,400 Cr',
    label: 'AUM Analyzed',
    description: 'Total assets under management scanned',
  },
  {
    icon: Zap,
    value: '8 sec',
    label: 'Avg. Analysis',
    description: 'From upload to complete report',
  },
  {
    icon: Shield,
    value: '99.9%',
    label: 'Uptime',
    description: 'Enterprise-grade infrastructure',
  },
];

const faqs = [
  {
    q: 'Is my financial data safe?',
    a: 'Absolutely. FolioX processes your CAS PDF entirely in-session. We never store your financial data on our servers. All analysis happens in a secure, sandboxed environment.',
  },
  {
    q: 'What is a CAS PDF and how do I get it?',
    a: 'A Consolidated Account Statement (CAS) is a single document showing all your mutual fund holdings. You can download it from MyCams (camsonline.com) or KFintech (kfintech.com) for free.',
  },
  {
    q: 'How is the Portfolio Health Score calculated?',
    a: 'Our proprietary algorithm evaluates 15+ parameters including diversification, expense ratios, fund overlap, risk-adjusted returns, and sector concentration to generate a 0-100 score.',
  },
  {
    q: 'Is FolioX free to use?',
    a: 'Yes, the core X-Ray analysis including XIRR, overlap detection, and Health Score is completely free. Premium features like AI-powered rebalancing plans will be available soon.',
  },
  {
    q: 'Do you provide financial advice?',
    a: 'FolioX is an analytical tool, not a financial advisor. We surface data-driven insights to help you make informed decisions. Always consult a SEBI-registered advisor for personalized advice.',
  },
];

const AnimatedNumber = ({ value }: { value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="font-mono text-3xl md:text-4xl font-bold text-foreground"
    >
      {value}
    </motion.span>
  );
};

const FAQItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="border-b border-border/40 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-6 flex items-center justify-between text-left gap-4 group"
      >
        <span className="font-heading text-[17px] text-foreground group-hover:text-primary transition-colors duration-200">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden"
      >
        <p className="font-body text-[15px] text-text-secondary leading-relaxed pb-6 pr-8">
          {a}
        </p>
      </motion.div>
    </motion.div>
  );
};

const TrustAndFAQ = () => {
  return (
    <section className="py-24 px-6 md:px-10 relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.3] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-6 md:p-8 rounded-[20px] bg-foreground/[0.02] border border-border/50 hover:border-primary/30 transition-all duration-500 group text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <AnimatedNumber value={stat.value} />
              <p className="font-heading text-sm font-semibold text-foreground mt-2 mb-1">
                {stat.label}
              </p>
              <p className="font-body text-[12px] text-text-muted leading-snug">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Header */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border text-foreground/60 text-[11px] font-bold uppercase tracking-[0.2em] mb-6"
            >
              FAQ
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl text-foreground tracking-tight mb-6"
            >
              Got <span className="text-primary italic">questions?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-body text-lg text-text-secondary max-w-md leading-relaxed"
            >
              Everything you need to know about FolioX. Can't find an answer?{' '}
              <a
                href="mailto:contact@foliox.ai"
                className="text-primary hover:underline"
              >
                Reach out to us
              </a>
              .
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {['SSL Encrypted', 'No Data Storage', 'SEBI Compliant', 'SOC-2'].map(
                (badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/15 text-primary text-[11px] font-bold uppercase tracking-wide"
                  >
                    {badge}
                  </span>
                )
              )}
            </motion.div>
          </div>

          {/* Right: FAQ Items */}
          <div className="rounded-[24px] bg-foreground/[0.02] border border-border/40 p-8 md:p-10">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustAndFAQ;
