import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Cpu, Shield, Activity, RefreshCw, X } from 'lucide-react';
import TypingStream from './TypingStream';
import NeuralLogs from './NeuralLogs';
import AIOrb from './AIOrb';
import ThinkingOverlay from './ThinkingOverlay';
import { useTelemetry } from '../../hooks/useTelemetry';
import { useAIStream } from '../../hooks/useAIStream';
import { aiMonitor } from '../../services/ai/AIConnectionMonitor';
import { useAuth } from '../../context/AuthContext';
import { portfolioKnowledge } from '../../config/portfolioKnowledge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const NeuralConsole: React.FC<{ onClose: () => void; portfolioState?: string; portfolioData?: any }> = ({ onClose, portfolioState, portfolioData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const telemetry = useTelemetry();
  const { stream, state: streamState } = useAIStream();
  const [metrics, setMetrics] = useState(aiMonitor.getMetrics());
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isThinking]);

  useEffect(() => {
    const onUpdate = (m: any) => setMetrics({ ...m });
    aiMonitor.on('metricsUpdate', onUpdate);
    return () => {
      aiMonitor.off('metricsUpdate', onUpdate);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isThinking || !user) return;

    const userMessage = input;
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsThinking(true);

    try {
      let currentAssistantMessage = "";
      
      const words = userMessage.trim().split(/\s+/);
      const knownKeywords = ['project', 'about', 'skills', 'contact', 'architecture', 'apis', 'portfolio', 'github', 'linkedin', 'open view', 'customize', 'theme'];
      const isVague = words.length < 3 && !knownKeywords.some(kw => userMessage.toLowerCase().includes(kw));
      const intentHint = isVague ? "VAGUE_QUERY" : undefined;

      await stream(userMessage, {
        path: location.pathname,
        timestamp: new Date().toISOString(),
        userId: user.uid,
        platform: 'NEURAL_OS_V4',
        knowledge: portfolioKnowledge,
        portfolioState: portfolioState,
        portfolioData: portfolioData,
        intentHint: intentHint
      }, {
        onToken: (token) => {
          setIsThinking(false);
          currentAssistantMessage += token;
          
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'assistant') {
              const updated = [...prev];
              updated[updated.length - 1] = { 
                role: 'assistant', 
                content: currentAssistantMessage 
              };
              return updated;
            } else {
              return [...prev, { role: 'assistant', content: currentAssistantMessage }];
            }
          });
        },
        onError: (err, details) => {
          console.error('[CONSOLE_ERROR]', err, details);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `LINK_FAILURE: ${err}. Please verify your neural uplink and retry.` 
          }]);
        },
        onDone: () => {
          setIsThinking(false);
        }
      });
    } catch (error: any) {
      console.error('[CONSOLE_EXCEPTION]', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `SYSTEM_REJECTION: ${error.message || 'The cognition engine is currently unreachable.'}` 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full liquid-glass-readable relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-theme-primary/50 to-transparent" />
        <div className="absolute inset-0 cyber-grid opacity-5" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-theme-primary/20 bg-theme-primary/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-theme-primary/10 rounded-lg border border-theme-primary/20">
            <Cpu size={18} className="text-theme-primary" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-medium tracking-[0.02em] text-white">Portfolio Assistant</h3>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${metrics.latency < 100 ? 'bg-theme-secondary' : 'bg-theme-accent'}`} />
              <span className="text-[8px] font-mono text-white/60 uppercase tracking-tighter">
                Link: {streamState === 'IDLE' ? 'READY' : streamState} // Latency: {metrics.latency}ms
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Telemetry */}
        <div className="w-32 border-r border-theme-primary/10 p-4 hidden md:flex flex-col gap-6 bg-black/20">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <AIOrb active={isThinking} />
              <span className="text-[8px] font-space-mono text-theme-primary uppercase">Core Alpha</span>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[7px] text-white/30 uppercase">Stability</span>
                <span className="text-[7px] text-theme-secondary font-bold">99%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-theme-secondary w-[99%]" />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-[7px] text-white/30 uppercase">Neural Load</span>
                <span className="text-[7px] text-theme-primary font-bold">{isThinking ? '82%' : '12%'}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: isThinking ? '82%' : '12%' }}
                  className="h-full bg-theme-primary" 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-auto border-t border-theme-primary/10 pt-4">
            <NeuralLogs />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-theme-primary/20">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <Terminal size={40} className="text-theme-primary mb-4 animate-pulse" />
                <p className="font-space-mono text-[10px] tracking-[0.3em] uppercase">Awaiting Neural Link...</p>
              </div>
            )}
            
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-xl relative overflow-hidden ${
                    msg.role === 'user' 
                      ? 'bg-theme-primary/10 border border-theme-primary/20 text-white p-4' 
                      : 'bg-white/5 border border-white/10 text-white/80 p-5 ai-response-rail'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${msg.role === 'user' ? 'bg-theme-primary shadow-[0_0_8px_rgba(var(--theme-primary-rgb),0.5)]' : 'bg-theme-secondary shadow-[0_0_8px_rgba(var(--theme-secondary-rgb),0.5)]'}`} />
                      <span className="text-[9px] font-mono uppercase tracking-[0.3em] opacity-50 font-bold">
                        {msg.role === 'user' ? 'You' : 'Portfolio Assistant'}
                      </span>
                    </div>
                    
                    <div className="text-[13px] md:text-sm leading-relaxed">
                      {msg.role === 'assistant' && i === messages.length - 1 && streamState === 'STREAMING' ? (
                        <div className="flex flex-col gap-2">
                           {msg.content}
                           <motion.span 
                             animate={{ opacity: [0, 1, 0] }}
                             transition={{ repeat: Infinity, duration: 0.8 }}
                             className="inline-block w-1.5 h-4 bg-theme-primary ml-1"
                           />
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>

                    <div className="mt-4 flex justify-between items-center opacity-20">
                      <div className="flex gap-1">
                        {[1, 2, 3].map(dot => <div key={dot} className="w-1 h-1 bg-white rounded-full" />)}
                      </div>
                      <span className="text-[7px] font-mono uppercase tracking-widest">
                        {msg.role === 'user' ? 'Direct_Uplink' : 'RESPONSE_READY'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isThinking && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start w-full max-w-2xl"
              >
                <ThinkingOverlay />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-theme-primary/20 bg-theme-primary/5">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about Vivek's work..."
                className="w-full bg-black/40 border border-theme-primary/30 rounded-lg py-3 px-4 pr-12 text-sm font-space-mono text-white placeholder:text-white/20 focus:outline-none focus:border-theme-primary transition-all group-hover:border-theme-primary/50 focus:ai-input-orbit"
              />
              <button 
                onClick={handleSend}
                disabled={isThinking}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all ${
                  input.trim() 
                    ? 'text-theme-primary hover:bg-theme-primary/20' 
                    : 'text-white/10'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-[7px] text-white/20 font-space-mono uppercase">Veraa levall da... neural systems online.</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Activity size={10} className="text-theme-primary" />
                  <span className="text-[7px] text-white/40 font-space-mono">Latency: {telemetry.latency}ms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={10} className="text-theme-secondary" />
                  <span className="text-[7px] text-white/40 font-space-mono">Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralConsole;
