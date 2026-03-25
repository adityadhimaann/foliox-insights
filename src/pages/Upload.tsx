import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UploadZone from '@/components/UploadZone';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleAnalyze = async () => {
    if (!file || loading) return;
    setLoading(true);

    if (file.name === 'CAMS_Mock_Statement_Aditya_Kumar.pdf') {
      // Mock performance data for Demo
      const mockAnalysis = {
        session_id: "demo-session-aditya",
        total_investment: 597000,
        total_current_value: 1024255,
        total_xirr: 0.1142,
        health_score: { total_score: 84 },
        benchmark: { benchmark_name: "Nifty 100", benchmark_xirr: 0.1120 },
        funds: [
          { fund_name: "SBI Small Cap Fund", xirr: 0.1814, category: "Small Cap", current_value: 136000, investment_value: 68000 },
          { fund_name: "Parag Parikh Flexi Cap Fund", xirr: 0.1431, category: "Flexi Cap", current_value: 367000, investment_value: 170000 },
          { fund_name: "HDFC Mid-Cap Opportunities Fund", xirr: 0.1372, category: "Mid Cap", current_value: 129000, investment_value: 76000 },
          { fund_name: "Mirae Asset Large Cap Fund", xirr: 0.1120, category: "Large Cap", current_value: 303000, investment_value: 205000 },
          { fund_name: "Axis Bluechip Fund", xirr: 0.0982, category: "Large Cap", current_value: 89255, investment_value: 78000 },
        ],
        overlap_matrix: [
          { fund_a: "Mirae Asset Large Cap Fund", fund_b: "Axis Bluechip Fund", overlap_percentage: 0.65 },
          { fund_a: "Mirae Asset Large Cap Fund", fund_b: "Parag Parikh Flexi Cap Fund", overlap_percentage: 0.25 },
          { fund_a: "Mirae Asset Large Cap Fund", fund_b: "HDFC Mid-Cap Opportunities Fund", overlap_percentage: 0.10 },
          { fund_a: "Axis Bluechip Fund", fund_b: "Parag Parikh Flexi Cap Fund", overlap_percentage: 0.20 },
          { fund_a: "Axis Bluechip Fund", fund_b: "HDFC Mid-Cap Opportunities Fund", overlap_percentage: 0.05 },
          { fund_a: "Parag Parikh Flexi Cap Fund", fund_b: "HDFC Mid-Cap Opportunities Fund", overlap_percentage: 0.30 },
          { fund_a: "SBI Small Cap Fund", fund_b: "Mirae Asset Large Cap Fund", overlap_percentage: 0.02 },
          { fund_a: "SBI Small Cap Fund", fund_b: "Parag Parikh Flexi Cap Fund", overlap_percentage: 0.05 },
          { fund_a: "SBI Small Cap Fund", fund_b: "HDFC Mid-Cap Opportunities Fund", overlap_percentage: 0.03 },
          { fund_a: "SBI Small Cap Fund", fund_b: "Axis Bluechip Fund", overlap_percentage: 0.01 }
        ],
        expense_drag: { 
          weighted_avg_expense_ratio: 0.0172, 
          category_avg_expense_ratio: 0.008,
          ten_year_drag_rupees: 88000,
          corpus_current_plan_10yr: 1800000,
          corpus_if_direct_10yr: 1888000
        },
        ai_recommendations: [
          { priority: 'high', action: 'Immediate action: Stop Axis Bluechip SIP & Redeem', detail: 'Axis Bluechip is your weakest performer (9.82%). It has ~65% overlap with Mirae Large Cap. The ₹11,251 gain is likely under the LTCG exemption limit — tax impact is minimal.', estimated_impact: 'Consolidate redundant Large Cap' },
          { priority: 'high', action: 'Redeploy the proceeds to Parag Parikh Flexi Cap', detail: 'Route the Axis Bluechip money into Parag Parikh Flexi Cap — it\'s your best performer, most diversified, and genuinely unique in the portfolio.', estimated_impact: 'Increase Portfolio Alpha' },
          { priority: 'medium', action: 'Longer-term: Switch to Direct Plans', detail: 'Consider Direct plans on platforms like MF Central. The ~₹10,000/year saving in expense ratios adds up to ₹1–2L extra over a decade through compounding.', estimated_impact: 'Save ₹10,000/year' },
          { priority: 'low', action: 'Don\'t touch: SBI Small Cap and HDFC Mid-Cap', detail: 'SBI Small Cap and HDFC Mid-Cap are doing exactly what they should with minimal overlap. Leave them alone.', estimated_impact: 'Maintain Growth Engine' }
        ],
        timeline: [
          { year: 2020, invested_amount: 100000, portfolio_value: 110000 },
          { year: 2021, invested_amount: 220000, portfolio_value: 280000 },
          { year: 2022, invested_amount: 350000, portfolio_value: 490000 },
          { year: 2023, invested_amount: 480000, portfolio_value: 720000 },
          { year: 2024, invested_amount: 597000, portfolio_value: 1024255 }
        ]
      };

      localStorage.setItem('foliox_last_analysis', JSON.stringify(mockAnalysis));
      
      // Proactively log activity so Recents tab in sidebar gets populated
      if (token) {
        fetch('http://localhost:8000/api/user/log-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ action: "analyzed_portfolio" })
        }).catch(err => console.log("Silent log failure", err));
      }
      
      navigate('/analyzing', { state: { sessionId: "demo-aditya", language, isDemo: true, analysis: mockAnalysis } });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name);
    formData.append('language', language);

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      const sessionId = data.session_id;

      // Navigate to analyzing page with session ID
      navigate('/analyzing', { state: { sessionId, language } });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload statement");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="page-bg flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="noise-overlay" />
      <Navbar />
      <div className="flex-1 max-w-[600px] mx-auto w-full px-6 pt-10 pb-16 relative z-2">
        <Link to="/" className="inline-flex items-center gap-1.5 text-text-muted font-body text-sm mb-8 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-2">Upload your statement</h2>
        <p className="font-body text-base text-text-secondary mb-8">
          We support CAMS and KFintech consolidated account statements (PDF)
        </p>

        <UploadZone onFileSelected={setFile} />

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div>
            <label className="font-body text-sm text-text-secondary mb-1.5 block">Your Name (optional)</label>
            <input
              type="text"
              placeholder="Rahul Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-12 rounded-lg px-4 font-body text-[15px] text-foreground outline-none transition-all duration-150 bg-foreground/5 dark:bg-[#070d1a]/60 border-[1.5px] border-border/40"
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,229,160,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,229,160,0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label className="font-body text-sm text-text-secondary mb-1.5 block">Language preference</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full h-12 rounded-lg px-4 font-body text-[15px] text-foreground outline-none transition-all duration-150 appearance-none bg-foreground/5 dark:bg-[#070d1a]/60 border-[1.5px] border-border/40"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className={`cta-pulse w-full h-14 mt-8 rounded-xl font-body text-[17px] font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
            file && !loading
              ? 'text-primary-foreground cursor-pointer hover:brightness-110'
              : 'cursor-not-allowed opacity-50'
          }`}
          style={{
            background: file ? 'linear-gradient(135deg, #00E5A0, #00C48C)' : 'rgba(0,229,160,0.3)',
            boxShadow: file ? '0 4px 20px rgba(0,229,160,0.35)' : 'none',
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            'Analyze My Portfolio →'
          )}
        </button>

        <p className="text-center font-body text-[13px] text-text-muted mt-4">
          🔒 Your statement is processed temporarily and never stored. Analysis happens in your session only.
        </p>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Upload;
