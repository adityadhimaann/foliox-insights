import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, History, Shield, LogOut, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Settings = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <motion.div
      className="page-bg min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="noise-overlay" />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-10 pb-20 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-text-muted font-body text-sm mb-8 hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar / Profile Card */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 mb-4">
                <User className="w-12 h-12 text-primary" />
              </div>
              <h2 className="font-heading text-2xl text-foreground mb-1">{user?.username}</h2>
              <p className="font-body text-sm text-text-muted mb-6">{user?.email}</p>
              
              <div className="w-full h-px bg-border/40 mb-6" />
              
              <div className="w-full space-y-2">
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-all font-body text-sm"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Settings Content */}
          <div className="flex-1 space-y-8">
            {/* Account Information */}
            <section className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-xl text-foreground">Account Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-[13px] text-text-muted mb-1.5 block">Display Name</label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5 border border-border/40">
                    <User className="w-4 h-4 text-text-muted" />
                    <span className="font-body text-sm text-foreground">{user?.username}</span>
                  </div>
                </div>
                <div>
                  <label className="font-body text-[13px] text-text-muted mb-1.5 block">Email Address</label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5 border border-border/40">
                    <Mail className="w-4 h-4 text-text-muted" />
                    <span className="font-body text-sm text-foreground">{user?.email}</span>
                  </div>
                </div>
              </div>
              
              <p className="font-body text-[12px] text-text-muted mt-6 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </section>

            {/* Recent Activity */}
            <section className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-xl text-foreground">Recent Activity</h3>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                   <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-all border border-transparent hover:border-border/40">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.action === 'login' ? 'bg-primary/10 text-primary' : 'bg-accent-blue/10 text-accent-blue'
                        }`}>
                           {item.action === 'login' ? <LogOut className="w-5 h-5" /> : <History className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-body text-sm text-foreground capitalize">{item.action.replace('_', ' ')}</p>
                          <p className="font-body text-[11px] text-text-muted">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-foreground/5 text-text-muted font-mono text-[10px]">SUCCESS</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-foreground/5 rounded-xl border border-dashed border-border/40">
                  <History className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-20" />
                  <p className="font-body text-sm text-text-muted">No recent activity found.</p>
                </div>
              )}
            </section>

            {/* Certain Things (Placeholders) */}
            <section className="glass-card p-6 border-red-500/20">
               <h3 className="font-heading text-xl text-foreground mb-4">Danger Zone</h3>
               <p className="font-body text-sm text-text-muted mb-6">Manage high-impact account actions.</p>
               
               <div className="space-y-3">
                 <button className="w-full flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all text-red-500 font-body text-sm">
                    <span>Delete Account & Data</span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                 </button>
               </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Settings;
