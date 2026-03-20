import { motion } from 'framer-motion';
import { Upload, BrainCircuit, ShieldCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Upload Statement',
    description: 'Export your CAMS or KFintech consolidated account statement as PDF. Takes 2 minutes.',
    icon: Upload,
  },
  {
    number: '02',
    title: 'AI Analyses Portfolio',
    description: 'Our AI reads every transaction, calculates your real returns, checks for hidden costs and redundant funds.',
    icon: BrainCircuit,
  },
  {
    number: '03',
    title: 'Get Your Health Score',
    description: 'Receive a 0–100 score with a personalized rebalancing plan in plain English or Hindi.',
    icon: ShieldCheck,
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-card py-24">
    <div className="max-w-[960px] mx-auto px-6">
      <p className="text-center text-primary text-xs font-body tracking-[0.12em] uppercase mb-3">
        HOW IT WORKS
      </p>
      <h2 className="text-center font-heading text-3xl md:text-[42px] text-text-primary mb-14">
        Three steps to financial clarity
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-shadow duration-200"
          >
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-5">
              <step.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="font-mono text-5xl text-accent/20 font-medium">{step.number}</span>
            <h3 className="font-body text-xl font-bold text-text-primary mt-2 mb-3">{step.title}</h3>
            <p className="font-body text-base text-text-secondary leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
