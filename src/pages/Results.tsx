import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainSidebar from '@/components/MainSidebar';
import SectionTrack from '@/components/SectionTrack';
import SummaryBar from '@/components/SummaryBar';
import XirrChart from '@/components/XirrChart';
import OverlapHeatmap from '@/components/OverlapHeatmap';
import ExpenseDragCard from '@/components/ExpenseDragCard';
import RebalancingPlan from '@/components/RebalancingPlan';
import TimelineChart from '@/components/TimelineChart';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const Results = () => {
  const [activeId, setActiveId] = useState('expense');
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any>(location.state?.analysis);
 
   useEffect(() => {
     if (!analysis) {
        // Try fallback
        const saved = localStorage.getItem('foliox_last_analysis');
        if (saved) {
           try {
              setAnalysis(JSON.parse(saved));
              return;
           } catch(e) {}
        }
        
        toast.error("No analysis data found. Please upload again.");
        navigate('/upload');
     }
   }, [analysis, navigate, setAnalysis]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, { threshold: 0.5, rootMargin: '-10% 0px -50% 0px' });

    const sections = ['expense', 'overlap', 'action', 'rebalance', 'timeline'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!analysis) return null;

  return (
    <motion.div
      className="page-bg flex h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="noise-overlay" />

      {/* 1. Far Left: Global Command Sidebar (Collapsible Icons) */}
      <MainSidebar />

      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden bg-background/20 backdrop-blur-sm w-full">
        <SummaryBar analysis={analysis} />

        <div className="flex-1 flex relative z-2 overflow-hidden w-full">
          {/* 2. Middle-Left: Section Progress Track (Wayfinding Spine) */}
          <SectionTrack activeId={activeId} />

          {/* 3. Main content: Expanded Visual Data HUB */}
          <main className="flex-1 p-6 md:p-12 space-y-20 overflow-y-auto no-scrollbar pb-12 w-full max-w-full">
            <div id="expense" className="scroll-mt-4 w-full">
              <XirrChart benchmark={analysis.benchmark} funds={analysis.funds} />
            </div>
            <div id="overlap" className="scroll-mt-4 w-full">
              <OverlapHeatmap matrix={analysis.overlap_matrix} funds={analysis.funds} />
            </div>
            <div id="action" className="scroll-mt-4 w-full">
              <ExpenseDragCard drag={analysis.expense_drag} />
            </div>
            <div id="rebalance" className="scroll-mt-4 w-full">
              <RebalancingPlan recommendations={analysis.ai_recommendations} />
            </div>
            <div id="timeline" className="scroll-mt-20 w-full min-h-[400px]">
              <TimelineChart points={analysis.timeline} />
            </div>
            
            <div className="pt-20 print:hidden">
               <Footer />
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default Results;
