import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnalyzingStepper from '@/components/AnalyzingStepper';
import { toast } from 'sonner';
import { useEffect } from 'react';

const Analyzing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = location.state?.sessionId;

  useEffect(() => {
    if (!sessionId) {
      toast.error("Session expired. Please upload again.");
      navigate('/upload');
    }
  }, [sessionId, navigate]);

  if (!sessionId) return null;

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <AnalyzingStepper 
        sessionId={sessionId}
        onComplete={(data) => {
          localStorage.setItem('foliox_last_analysis', JSON.stringify(data));
          navigate('/results', { state: { analysis: data } });
        }} 
        onError={(err) => {
          toast.error(err);
          navigate('/upload');
        }}
      />
    </motion.div>
  );
};

export default Analyzing;
