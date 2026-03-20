import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnalyzingStepper from '@/components/AnalyzingStepper';

const Analyzing = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <AnalyzingStepper onComplete={() => navigate('/results')} />
    </motion.div>
  );
};

export default Analyzing;
