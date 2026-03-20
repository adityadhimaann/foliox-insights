import { useNavigate } from 'react-router-dom';
import AnalyzingStepper from '@/components/AnalyzingStepper';

const Analyzing = () => {
  const navigate = useNavigate();
  return <AnalyzingStepper onComplete={() => navigate('/results')} />;
};

export default Analyzing;
