import { motion } from 'framer-motion';
import { Send, Twitter, Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscribeSection = () => {
  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'X-Ray Analysis', href: '#' },
        { name: 'Health Score', href: '#' },
        { name: 'Rebalancing Plan', href: '#' },
        { name: 'Tax Optimizer', href: '#', badge: 'Soon' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About FolioX', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Sample Reports', href: '#' },
        { name: 'Financial Blog', href: '#' },
        { name: 'Contact Support', href: '#' },
      ],
    },
  ];

  return (
    <section className="pt-16 pb-16 px-6 md:px-10 relative overflow-hidden bg-background">
      {/* Background radial accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 xl:gap-32 mb-24">
           {/* Section Left: Newsletter & Branding */}
           <div className="flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
              >
                FolioX newsletter
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-heading text-4xl md:text-5xl text-foreground mb-6 leading-[1.1]"
              >
                Join the elite <br />
                <span className="text-primary italic">investor circle.</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-body text-lg text-text-secondary mb-10 max-w-lg"
              >
                Weekly actionable insights on fund overlap, taxation, and rebalancing plans. No spam, just pure intelligence.
              </motion.p>
              
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-md relative group px-1"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full h-14 pl-5 pr-36 rounded-2xl bg-foreground/5 border border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 font-body text-foreground"
                    required
                  />
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1.5 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                  >
                    Join <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
           </div>

           {/* Section Right: Multi-column Links */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              {footerLinks.map((column, i) => (
                <motion.div 
                  key={column.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="space-y-6"
                >
                  <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground">
                    {column.title}
                  </h4>
                  <ul className="space-y-4">
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <a 
                          href={link.href} 
                          className="font-body text-[15px] text-text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group/link"
                        >
                          {link.name}
                          {link.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-tighter">
                               {link.badge}
                            </span>
                          )}
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Final Connect & Branding Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-border/40 gap-8">
           <div className="flex items-center gap-3">
              <span className="font-heading text-2xl tracking-tight">
                <span className="text-foreground">Folio</span>
                <span className="text-primary">X</span>
              </span>
              <div className="h-4 w-px bg-border/60 hidden md:block" />
              <p className="font-body text-[13px] text-text-muted">© 2024 FolioX Financial. All rights reserved.</p>
           </div>

           <div className="flex items-center gap-8">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Mail, href: 'mailto:contact@foliox.ai', label: 'Email' },
              ].map((social) => (
                <a 
                  key={social.label} 
                  href={social.href}
                  className="group relative flex items-center justify-center"
                  aria-label={social.label}
                >
                  <div className="absolute -inset-3 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200" />
                  <social.icon className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors duration-200" />
                </a>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
