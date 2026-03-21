import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UploadZone from '@/components/UploadZone';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file || loading) return;
    setLoading(true);

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
