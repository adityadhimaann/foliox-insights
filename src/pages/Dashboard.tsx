import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import MainSidebar from '@/components/MainSidebar';
import { 
  User, 
  History, 
  Plus, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Shield, 
  Settings as SettingsIcon,
  PieChart,
  Activity,
  Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioScore, setPortfolioScore] = useState('84');
  
  useEffect(() => {
    const saved = localStorage.getItem('foliox_last_analysis');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.health_score?.total_score) {
          setPortfolioScore(Math.round(parsed.health_score.total_score).toString());
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, navigate]);

  const stats = [
    { label: 'Total Analyses', value: history.length, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Portfolio Score', value: `${portfolioScore}/100`, icon: Shield, color: 'text-[#00E5A0]', bg: 'bg-[#00E5A0]/10' },
    { label: 'Activity Rate', value: '+12%', icon: TrendingUp, color: 'text-[#00E5A0]', bg: 'bg-[#00E5A0]/10' },
  ];

  const uploadsCount = history.filter(h => h.action.includes('analyz')).length;
  const reportsCount = uploadsCount; // Assuming 1 report per analysis normally

  const quickActions = [
    { label: 'Upload Statement', icon: Plus, path: '/upload', description: 'Analyze new portfolio' },
    { label: 'View Last Result', icon: PieChart, path: '/results', description: 'See your latest report' },
    { label: 'Account Settings', icon: SettingsIcon, path: '/settings', description: 'Manage your profile' },
  ];

  return (
    <motion.div
      className="page-bg h-screen flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="noise-overlay" />
      <MainSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto no-scrollbar relative z-10 w-full max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">
                Welcome back, <span className="text-primary font-bold">{user?.username}</span>
              </h1>
              <p className="font-body text-text-muted">Here's a summary of your portfolio insights and activities.</p>
            </div>
            <Link 
              to="/upload" 
              className="px-6 py-3 rounded-xl bg-primary text-secondary font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 group w-fit"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> 
              Upload New Statement
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-center justify-between group hover:border-primary/40 transition-all duration-300"
              >
                <div className="space-y-1">
                  <p className="font-body text-sm text-text-muted">{stat.label}</p>
                  <p className="font-heading text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-7 h-7 ${stat.color} drop-shadow-sm`} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Quick Actions & Dashboard Content */}
            <div className="lg:col-span-8 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-xl text-foreground">Quick Shortcuts</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map((action, i) => (
                    <Link
                      key={action.label}
                      to={action.path}
                      className="glass-card p-5 group hover:bg-foreground/[0.03] transition-all border-border/40 hover:border-primary/30"
                    >
                      <div className="w-10 h-10 bg-foreground/5 rounded-lg flex items-center justify-center mb-4 text-text-muted group-hover:text-primary transition-colors">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-sm text-foreground mb-1 group-hover:translate-x-1 transition-transform">{action.label}</h3>
                      <p className="font-body text-[12px] text-text-muted">{action.description}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="glass-card p-0 overflow-hidden">
                <div className="p-6 border-b border-border/40 flex items-center justify-between bg-foreground/[0.02]">
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-primary" />
                    <h2 className="font-heading text-xl text-foreground">Complete Log</h2>
                  </div>
                  <button className="text-[12px] font-bold text-primary hover:underline">View All Activities</button>
                </div>
                
                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="font-body text-sm text-text-muted">Analyzing history...</p>
                    </div>
                  ) : history.length > 0 ? (
                    <div className="space-y-1">
                      {history.map((item, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-foreground/[0.04] transition-all border border-transparent hover:border-border/40 group"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
                              item.action === 'login' ? 'bg-primary/10 text-primary shadow-primary/10' : 'bg-blue-500/10 text-blue-500 shadow-blue-500/10'
                            }`}>
                              {item.action === 'login' ? <User className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-heading text-[15px] text-foreground capitalize">
                                {item.action.replace('_', ' ')}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Calendar className="w-3 h-3 text-text-muted" />
                                <span className="font-body text-[12px] text-text-muted">
                                  {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-[10px] text-text-muted/40">•</span>
                                <Clock className="w-3 h-3 text-text-muted" />
                                <span className="font-body text-[12px] text-text-muted">
                                  {new Date(item.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                             <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                               <CheckCircle2 className="w-3 h-3" /> COMPLETED
                             </span>
                             <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-foreground/5 rounded-2xl border border-dashed border-border/40">
                      <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/40">
                         <History className="w-8 h-8 text-text-muted/30" />
                      </div>
                      <h3 className="font-heading text-lg text-foreground mb-1">No activities found</h3>
                      <p className="font-body text-sm text-text-muted max-w-[280px] mx-auto italic">
                        Upload your first statement to start tracking your portfolio journey.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Profile Overview (Sidebar Style) */}
            <div className="lg:col-span-4 space-y-6">
              <section className="glass-card p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16" />
                
                <div className="flex flex-col items-center text-center relative z-2">
                  <div className="w-24 h-24 rounded-full bg-foreground/5 border-2 border-primary/20 flex items-center justify-center mb-5 p-1">
                     <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        <User className="w-12 h-12 text-primary" />
                     </div>
                  </div>
                  <h3 className="font-heading text-2xl text-foreground mb-1">{user?.username}</h3>
                  <p className="font-body text-sm text-text-muted mb-6">{user?.email}</p>
                  
                  <div className="w-full grid grid-cols-2 gap-3 mb-6">
                     <div className="p-3 bg-foreground/[0.03] rounded-xl border border-border/40">
                        <p className="font-body text-[10px] text-text-muted uppercase tracking-wider mb-1">Uploads</p>
                        <p className="font-heading text-lg font-bold text-foreground">{uploadsCount.toString().padStart(2, '0')}</p>
                     </div>
                     <div className="p-3 bg-foreground/[0.03] rounded-xl border border-border/40">
                        <p className="font-body text-[10px] text-text-muted uppercase tracking-wider mb-1">Reports</p>
                        <p className="font-heading text-lg font-bold text-foreground">{history.length.toString().padStart(2, '0')}</p>
                     </div>
                  </div>

                  <Link 
                    to="/settings" 
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/40 transition-all font-body text-sm text-foreground active:scale-95"
                  >
                    Edit Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>

              {/* Upgrade Banner */}
              <section className="relative p-6 rounded-[2rem] overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent-blue" />
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                 
                 <div className="relative z-2">
                    <h3 className="font-heading text-xl text-black font-bold mb-2">Upgrade to Pro</h3>
                    <p className="font-body text-sm text-black/70 mb-4 font-medium">Unlock advanced asset class correlation and tax harvesting strategies.</p>
                    <button className="px-5 py-2.5 rounded-full bg-black text-white font-bold text-[13px] hover:scale-105 transition-transform">Get Started</button>
                 </div>
                 
                 <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-black/10 transition-transform group-hover:scale-110" />
              </section>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default Dashboard;
