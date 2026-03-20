import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UploadZone from '@/components/UploadZone';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('english');

  const handleAnalyze = () => {
    if (file) navigate('/analyzing');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-[600px] mx-auto w-full px-6 pt-10 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-text-muted font-body text-sm mb-8 hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h2 className="font-heading text-3xl md:text-4xl text-text-primary mb-2">Upload your statement</h2>
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
              className="w-full h-12 rounded-lg border-[1.5px] border-border px-4 font-body text-[15px] text-text-primary bg-card focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none transition-all duration-150"
            />
          </div>
          <div>
            <label className="font-body text-sm text-text-secondary mb-1.5 block">Language preference</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full h-12 rounded-lg border-[1.5px] border-border px-4 font-body text-[15px] text-text-primary bg-card focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none transition-all duration-150 appearance-none"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!file}
          className={`w-full h-14 mt-8 rounded-xl font-body text-[17px] font-medium transition-all duration-150 ${
            file
              ? 'bg-primary text-primary-foreground hover:brightness-125 cursor-pointer'
              : 'bg-primary/50 text-primary-foreground/50 cursor-not-allowed'
          }`}
        >
          Analyze My Portfolio
        </button>

        <p className="text-center font-body text-[13px] text-text-muted mt-4">
          🔒 Your statement is processed temporarily and never stored. Analysis happens in your session only.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Upload;
