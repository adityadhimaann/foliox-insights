import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SummaryBar from '@/components/SummaryBar';
import FundSidebar from '@/components/FundSidebar';
import XirrChart from '@/components/XirrChart';
import OverlapHeatmap from '@/components/OverlapHeatmap';
import ExpenseDragCard from '@/components/ExpenseDragCard';
import RebalancingPlan from '@/components/RebalancingPlan';
import TimelineChart from '@/components/TimelineChart';
import Footer from '@/components/Footer';

const Results = () => (
  <motion.div
    className="page-bg flex flex-col"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
  >
    <div className="noise-overlay" />

    {/* Nav */}
    <div className="px-6 md:px-10 pt-4 relative z-2">
      <Link to="/" className="inline-flex items-center gap-1.5 text-text-muted font-body text-sm hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>

    <SummaryBar />

    {/* Mobile score ring (shown above cards on small screens) */}
    <div className="lg:hidden px-6 pt-6 relative z-2">
      {/* Score ring is already in FundSidebar, which renders inline on mobile */}
    </div>

    <div className="flex-1 flex flex-col lg:flex-row relative z-2">
      <FundSidebar />
      <main className="flex-1 p-6 md:p-8 space-y-6">
        <XirrChart />
        <OverlapHeatmap />
        <ExpenseDragCard />
        <RebalancingPlan />
        <TimelineChart />
      </main>
    </div>

    <Footer />
  </motion.div>
);

export default Results;
