import SummaryBar from '@/components/SummaryBar';
import FundSidebar from '@/components/FundSidebar';
import XirrChart from '@/components/XirrChart';
import OverlapHeatmap from '@/components/OverlapHeatmap';
import ExpenseDragCard from '@/components/ExpenseDragCard';
import RebalancingPlan from '@/components/RebalancingPlan';
import TimelineChart from '@/components/TimelineChart';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Results = () => (
  <div className="min-h-screen bg-background flex flex-col">
    {/* Top nav */}
    <div className="bg-bg-dark px-6 md:px-10 pt-4">
      <Link to="/" className="inline-flex items-center gap-1.5 text-text-muted font-body text-sm hover:text-primary-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>

    <SummaryBar />

    <div className="flex-1 flex flex-col lg:flex-row">
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
  </div>
);

export default Results;
