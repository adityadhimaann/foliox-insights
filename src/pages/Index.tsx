import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DemoSection from '@/components/DemoSection';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import TrustAndFAQ from '@/components/TrustAndFAQ';
import SubscribeSection from '@/components/SubscribeSection';

const Index = () => (
  <motion.div
    className="page-bg"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
  >
    <div className="noise-overlay" />
    <Navbar />
    <HeroSection />
    <DemoSection />
    <HowItWorks />
    <Testimonials />
    <TrustAndFAQ />
    <SubscribeSection />
  </motion.div>
);

export default Index;
