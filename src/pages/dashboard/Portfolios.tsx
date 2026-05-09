import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, PlusCircle, Search, ExternalLink, Edit3, Trash2 } from 'lucide-react';
import HologramPanel from '../../components/HologramPanel';
import { getUserPortfolios, createPortfolio, deletePortfolio, duplicatePortfolio, PortfolioData } from '../../lib/portfolio';
import { useAuth } from '../../context/AuthContext';

const Portfolios: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = React.useState<PortfolioData[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = React.useState<PortfolioData | null>(null);

  const fetchPortfolios = React.useCallback(async () => {
    if (user) {
      const data = await getUserPortfolios(user.uid);
      setPortfolios(data);
    }
  }, [user]);

  React.useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const handleCreate = async () => {
    if (!user || isCreating) return;
    setIsCreating(true);
    try {
      await createPortfolio(user.uid, { 
        name: `NEURAL_UNIT_${portfolios.length + 1}`,
        theme: 'MASTER_OS'
      });
      await fetchPortfolios();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("TERMINATE_NODE: Are you sure?")) return;
    try {
      await deletePortfolio(id);
      await fetchPortfolios();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicate = async (portfolio: PortfolioData) => {
    if (!user || isCreating) return;
    setIsCreating(true);
    try {
      await duplicatePortfolio(user.uid, portfolio);
      await fetchPortfolios();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (portfolio: PortfolioData) => {
    setSelectedPortfolio(portfolio);
    setIsEditModalOpen(true);
  };

  const handlePreview = (id: string) => {
    navigate(`/preview/${id}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-orbitron text-2xl font-black tracking-widest text-white neon-text-glow">PORTFOLIO_NODES</h2>
          <p className="text-[10px] font-space-mono text-white/40 uppercase tracking-widest mt-1">Status: {portfolios.length} Active Units</p>
        </div>
        <button 
          onClick={handleCreate}
          disabled={isCreating}
          className="group flex items-center justify-center gap-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue px-8 py-4 rounded-xl font-orbitron text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-neon-blue hover:text-dark-bg transition-all shadow-[0_0_30px_rgba(0,212,255,0.2)]"
        >
          <PlusCircle size={18} className={isCreating ? 'animate-spin' : 'group-hover:rotate-90 transition-transform'} />
          {isCreating ? 'INITIALIZING_DEPLOYMENT...' : 'INITIATE_NEW_BUILD'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {portfolios.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <HologramPanel title={p.name} className="group h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
                        <span className="text-[8px] font-space-mono text-neon-green uppercase tracking-widest">Deployed_Core</span>
                      </div>
                      <p className="text-[9px] text-white/40 font-space-mono uppercase mt-2">Node_ID: {p.id?.slice(0, 8)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDuplicate(p)}
                        title="Duplicate Node"
                        className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:border-neon-blue hover:text-neon-blue transition-all"
                      >
                        <PlusCircle size={14} />
                      </button>
                      <button 
                        onClick={() => handleEdit(p)}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:border-neon-blue hover:text-neon-blue transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => p.id && handleDelete(p.id)}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:border-neon-pink hover:text-neon-pink transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[160px] bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center justify-center overflow-hidden relative group-hover:border-neon-blue/20 transition-all mb-6">
                    <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 border border-dashed border-white/10 rounded-full flex items-center justify-center"
                    >
                      <Grid size={24} className="text-white/10 group-hover:text-neon-blue/40 transition-colors" />
                    </motion.div>
                    <span className="mt-4 font-orbitron text-[8px] font-bold text-white/20 uppercase tracking-[0.5em] group-hover:text-neon-blue transition-colors">Neural_Preview_Active</span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleEdit(p)}
                      className="flex-1 bg-white/5 border border-white/10 py-3 rounded-lg text-[9px] font-space-mono uppercase tracking-[0.3em] font-bold hover:bg-white/10 transition-all"
                    >
                      CONFIG_UNIT
                    </button>
                    <button 
                      onClick={() => p.id && handlePreview(p.id)}
                      className="px-4 border border-neon-blue/30 text-neon-blue rounded-lg hover:bg-neon-blue/10 transition-all shadow-[0_0_15px_rgba(0,212,255,0.1)]"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </HologramPanel>
            </motion.div>
          ))}
        </AnimatePresence>

        {portfolios.length === 0 && !isCreating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="col-span-full py-48 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Grid size={40} className="text-white/40" />
            </div>
            <h3 className="font-orbitron text-xl font-bold tracking-[0.4em] uppercase text-white mb-3">No Active Nodes Detected</h3>
            <p className="font-space-mono text-[9px] uppercase text-white/40 tracking-widest max-w-xs">Initialize your first neural build cluster to begin deployment.</p>
          </motion.div>
        )}
      </div>

      {/* Edit/Config Modal placeholder - will implement real one if needed, but for now just showing structure */}
    </div>
  );
};

export default Portfolios;
