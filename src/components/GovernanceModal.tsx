import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Database, Brain, Award, BarChart2, Cpu, Clock, FileText } from 'lucide-react';

type TabId = 'PRIVACY_POLICY' | 'DATA_COLLECTION' | 'AI_GOVERNANCE' | 'ISO_9001' | 'CMMI_PROCESS' | 'RAG_RUNTIME' | 'LEGACY_PROTOCOLS' | 'TERMS_OF_OPERATION';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'PRIVACY_POLICY',     label: 'Privacy Policy',     icon: Shield },
  { id: 'DATA_COLLECTION',    label: 'Data Collection',    icon: Database },
  { id: 'AI_GOVERNANCE',      label: 'AI Governance',      icon: Brain },
  { id: 'ISO_9001',           label: 'ISO 9001',           icon: Award },
  { id: 'CMMI_PROCESS',       label: 'CMMI Process',       icon: BarChart2 },
  { id: 'RAG_RUNTIME',        label: 'RAG Runtime',        icon: Cpu },
  { id: 'LEGACY_PROTOCOLS',   label: 'Legacy Protocols',   icon: Clock },
  { id: 'TERMS_OF_OPERATION', label: 'Terms',              icon: FileText },
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <span className="w-2 h-2 rounded-full" style={{ background: 'var(--theme-primary,#00d4ff)', boxShadow: '0 0 10px var(--theme-primary,#00d4ff)' }} />
      <h4 className="font-orbitron text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--theme-primary,#00d4ff)' }}>{title}</h4>
    </div>
    <div className="pl-6 space-y-4 font-space-mono text-sm text-white/70 leading-relaxed tracking-wide">
      {children}
    </div>
  </div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block px-3 py-1 rounded-md border text-[10px] font-space-mono uppercase tracking-widest mr-2 mb-2"
    style={{ borderColor: 'var(--theme-primary,#00d4ff)33', color: 'var(--theme-primary,#00d4ff)', background: 'var(--theme-primary,#00d4ff)08' }}>
    {children}
  </span>
);

const CONTENT: Record<TabId, React.ReactNode> = {
  PRIVACY_POLICY: (
    <div className="space-y-12">
      <Section title="Data We Collect">
        <p>Neural OS collects only the minimum data necessary to operate the platform — your authentication identity, session metadata, and user-configured preferences stored in Firestore under your UID namespace.</p>
        <p>We explicitly do <strong className="text-white/90">not</strong> collect: passwords, raw API keys, payment data, biometric data, or sensitive personal information beyond your OAuth-provided profile.</p>
      </Section>
      <Section title="Authentication Metadata">
        <p>Login is handled via Google OAuth / GitHub OAuth through Firebase Authentication. Neural OS never touches your password. Only your UID, email, display name, and photo URL are stored as read-only references.</p>
      </Section>
      <Section title="Telemetry & Analytics">
        <p>Runtime telemetry — such as deployment logs, cognitive processing indicators, and UI interaction states — is collected locally and persisted only within your Firestore user namespace.</p>
        <p>No telemetry data is shared with third parties. Analytics are used solely to improve your system performance and configuration state.</p>
      </Section>
      <Section title="AI Prompt Processing">
        <p>Prompts submitted to the Cognition Engine are forwarded to the configured model endpoint (Gemini API). Neural OS does not store raw prompts beyond the session. Response artifacts may be cached locally in your browser session for performance.</p>
      </Section>
      <Section title="Encrypted Persistence">
        <p>All preference data is stored in Firestore with Firestore Security Rules enforcing strict per-user access boundaries. No user can access another user's data namespace.</p>
        <div className="pt-4 flex flex-wrap"><Tag>No Passwords Stored</Tag><Tag>No Raw Keys Exposed</Tag><Tag>No Payment Data</Tag><Tag>OAuth-Only Auth</Tag></div>
      </Section>
    </div>
  ),

  DATA_COLLECTION: (
    <div className="space-y-12">
      {[
        { layer: 'IDENTITY_LAYER', items: ['OAuth UID (read-only)', 'Email address', 'Display name', 'Profile photo URL', 'Auth provider ID'] },
        { layer: 'SYSTEM_LAYER',   items: ['Session timestamps', 'Theme preferences', 'Glow/glass settings', 'Audio configuration', 'Motion settings', 'Locale and timezone'] },
        { layer: 'AI_LAYER',       items: ['Selected AI model cluster', 'Cognition depth preference', 'Telemetry density rate', 'Cinematic mode flag', 'Realtime processing toggle'] },
        { layer: 'RUNTIME_LAYER',  items: ['Deployment stage logs (in-session)', 'Recalibration pipeline results', 'Portfolio render state', 'Dashboard tab navigation events'] },
      ].map(({ layer, items }) => (
        <Section key={layer} title={layer}>
          <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                <span className="text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </div>
  ),

  AI_GOVERNANCE: (
    <div className="space-y-12">
      <Section title="System Ideology">
        <p className="text-lg text-white/80 font-orbitron tracking-wide">Neural OS operates under a Privacy-First Intelligence framework.</p>
        <p>Every AI subsystem is designed to augment human capability without eroding user autonomy, transparency, or control.</p>
      </Section>
      {[
        { title: 'Privacy-First Intelligence', desc: 'All cognition runs within user-defined boundaries. No inference is made without explicit invocation. Prompt data is not retained cross-session.' },
        { title: 'Explainable AI', desc: 'The platform surfaces reasoning steps, telemetry indicators, and stage-based pipeline visibility so users can audit and understand every AI decision.' },
        { title: 'Modular Governance', desc: 'Each AI component (Cognition Engine, RAG Runtime, Deployment Simulator) operates as an isolated module with defined input/output contracts and traceable execution logs.' },
        { title: 'Human-Centered Augmentation', desc: 'Neural OS is designed as an augmentation tool. Every AI output is advisory. Users retain full control over all deployment, configuration, and portfolio decisions.' },
        { title: 'Transparent Cognition', desc: 'System telemetry, recalibration logs, and AI stage outputs are surfaced directly in the UI — no black-box operations.' },
        { title: 'Adaptive Quality Optimization', desc: 'The platform continuously refines its runtime performance through user-preference feedback loops and session-based telemetry analysis.' },
      ].map(p => (
        <Section key={p.title} title={p.title}><p>{p.desc}</p></Section>
      ))}
    </div>
  ),

  ISO_9001: (
    <div className="space-y-12">
      <p className="font-space-mono text-sm text-white/50 italic border border-white/10 rounded-xl px-6 py-4 bg-white/[0.02] leading-relaxed">
        Neural OS is modeled after ISO 9001 Quality Management System principles. This platform does not claim official ISO certification. All references are architectural inspirations from internationally recognized QMS frameworks.
      </p>
      {[
        { title: 'Customer Focus & Requirements Traceability', desc: 'Every feature is traceable to a defined user requirement. The Config panel maps directly to SystemPreferences, ensuring every setting has a traceable effect on system behavior.' },
        { title: 'Documented Information Systems', desc: 'Governance documentation, data policies, and process definitions are surfaced within the Neural Console. Configuration changes are timestamped and synced to Firestore with merge semantics.' },
        { title: 'Process Control Architecture', desc: 'The Deployment Engine runs a structured 6-stage lifecycle. Each stage is validated before progression, mirroring process control requirements in production QMS environments.' },
        { title: 'Continuous Improvement Lifecycle', desc: 'The Recalibration Pipeline implements a continuous improvement loop: Scan → Rebuild → Optimize → Synchronize → Validate. This mirrors the Plan-Do-Check-Act cycle central to ISO 9001.' },
        { title: 'Runtime Audit Architecture', desc: 'All deployment events generate immutable terminal logs. These logs are timestamped and visible in the deployment telemetry overlay for full auditability.' },
      ].map(p => (
        <Section key={p.title} title={p.title}><p>{p.desc}</p></Section>
      ))}
    </div>
  ),

  CMMI_PROCESS: (
    <div className="space-y-8">
      <p className="font-space-mono text-sm text-white/50 italic border border-white/10 rounded-xl px-6 py-4 bg-white/[0.02] mb-4">
        Neural OS process maturity is architected with inspiration from the CMMI (Capability Maturity Model Integration) framework.
      </p>
      {[
        { level: 'LEVEL_1', name: 'INITIAL', color: '#ff006e', desc: 'Ad-hoc process execution. Core authentication and Firestore bootstrapping establish the initial operational baseline.' },
        { level: 'LEVEL_2', name: 'MANAGED', color: '#ffee00', desc: 'Requirements are tracked per user session. Configuration preferences are managed with documented defaults, persistence guarantees, and Firestore sync verification.' },
        { level: 'LEVEL_3', name: 'DEFINED', color: '#00d4ff', desc: 'Standardized process definitions across Deployment, Configuration, and Cognition modules. Each module has defined input contracts, execution stages, and output artifacts.' },
        { level: 'LEVEL_4', name: 'QUANTITATIVE', color: '#00ff88', desc: 'Telemetry density, glow intensity, cognition depth, and recalibration pipeline timings are quantitatively controlled through the Configuration Engine.' },
        { level: 'LEVEL_5', name: 'OPTIMIZING', color: '#9d00ff', desc: 'Continuous process refinement through adaptive telemetry feedback loops, runtime recalibration pipelines, and user preference evolution tracking across sessions.' },
      ].map(l => (
        <div key={l.level} className="flex gap-6 p-6 rounded-2xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-colors">
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-orbitron font-black text-xs"
              style={{ background: `${l.color}15`, border: `1px solid ${l.color}33`, color: l.color, boxShadow: `0 0 20px ${l.color}10` }}>
              L{l.level.split('_')[1]}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-orbitron text-xs font-black tracking-[0.2em]" style={{ color: l.color }}>{l.level}</span>
              <span className="font-space-mono text-xs text-white/20">|</span>
              <span className="font-orbitron text-xs text-white/80 tracking-widest">{l.name}</span>
            </div>
            <p className="font-space-mono text-sm text-white/50 leading-relaxed">{l.desc}</p>
          </div>
        </div>
      ))}
    </div>
  ),

  RAG_RUNTIME: (
    <div className="space-y-12">
      <Section title="Retrieval-Augmented Generation Architecture">
        <p>The Neural OS Cognition Engine implements a Retrieval-Augmented Generation (RAG) pattern where contextual portfolio data, user preferences, and system telemetry are injected into the prompt context window at inference time.</p>
        <p>This enables personalized, context-aware AI responses without storing raw conversation history cross-session.</p>
      </Section>
      <Section title="Telemetry Mapping">
        <p>Runtime telemetry signals (cognition depth, model cluster selection, telemetry density rate) are mapped to runtime parameters that adjust the inference pipeline dynamically per user configuration.</p>
        <div className="pt-4 flex flex-wrap"><Tag>Dynamic Context Injection</Tag><Tag>Session-Scoped Memory</Tag><Tag>User-Preference Routing</Tag></div>
      </Section>
      <Section title="Distributed Cognition Pipelines">
        <p>Processing is distributed across isolated module boundaries: Portfolio Context → Cognition Engine → Response Formatter → UI Render Layer. Each stage has defined latency budgets and failure fallbacks.</p>
      </Section>
      <Section title="TCP Synchronization">
        <p>Firestore's WebSocket-based real-time sync provides the transport layer for preference state propagation. Changes in one browser session are synchronized to all active sessions via the onSnapshot listener architecture.</p>
      </Section>
      <Section title="Adaptive Memory Routing">
        <p>User session context is maintained in React state and localStorage. Between sessions, only structured preference objects are restored — no raw AI conversation history or sensitive prompt data is persisted.</p>
      </Section>
    </div>
  ),

  LEGACY_PROTOCOLS: (
    <div className="space-y-12">
      <Section title="Legacy Compatibility Architecture">
        <p>Neural OS is engineered with a progressive enhancement model. Core functionality operates on modern Chromium and Firefox engines. Graceful fallbacks exist for environments with reduced support for CSS backdrop-filter and WebSocket connections.</p>
      </Section>
      <Section title="Adaptive Rendering Fallbacks">
        <p>The Liquid Glass Translucency system detects support for backdrop-filter at runtime. If unsupported, the --glass-blur variable is set to 0px and background-color opacity is increased to maintain visual separation and readability.</p>
      </Section>
      <Section title="Protocol Version Registry">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          {[
            ['NEURAL_OS_PROTOCOL',   'v4.2.0', 'Current Production'],
            ['FIREBASE_SDK',         'v10.x',  'Auth + Firestore'],
            ['GEMINI_API',           'v1.5',   'Cognition Layer'],
            ['FRAMER_MOTION',        'v11.x',  'Animation Runtime'],
            ['REACT_ROUTER',         'v6.x',   'Navigation Layer'],
            ['VITE_BUILD',           'v5.x',   'Asset Pipeline'],
          ].map(([name, ver, role], i) => (
            <div key={name} className={`flex items-center justify-between p-6 ${i !== 5 ? 'border-b border-white/[0.05]' : ''}`}>
              <div className="space-y-1">
                <span className="font-orbitron text-[10px] font-bold tracking-[0.2em]" style={{ color: 'var(--theme-primary,#00d4ff)' }}>{name}</span>
                <p className="font-space-mono text-[10px] text-white/30 uppercase tracking-widest">{role}</p>
              </div>
              <span className="font-space-mono text-xs text-white/80 bg-white/5 px-3 py-1 rounded-md">{ver}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),

  TERMS_OF_OPERATION: (
    <div className="space-y-12">
      <Section title="Scope of Use">
        <p>Neural OS is a portfolio and AI workspace platform designed for individual architects, developers, and engineers. Use of this platform is subject to Firebase Terms of Service and Google Cloud Platform usage policies for all backend services.</p>
      </Section>
      <Section title="User Responsibilities">
        <p>Users are responsible for the content of portfolios, deployment configurations, and AI prompts submitted through the platform. Neural OS does not review, moderate, or filter user-generated content submitted to external AI endpoints.</p>
      </Section>
      <Section title="Service Availability">
        <p>Neural OS does not guarantee 100% uptime. Platform availability depends on Firebase infrastructure, Gemini API availability, and network connectivity. Planned maintenance windows are communicated via system notifications when applicable.</p>
      </Section>
      <Section title="Data Ownership">
        <p>All portfolio data, preference configurations, and deployment artifacts created within Neural OS remain the intellectual property of the creating user. Neural OS claims no ownership over user-generated content.</p>
      </Section>
      <Section title="Limitation of Liability">
        <p>Neural OS is provided as-is without warranty of any kind. The platform developers are not liable for data loss resulting from Firestore service interruptions, accidental account deletion, or third-party API failures beyond our operational control.</p>
      </Section>
      <Section title="Modifications to Terms">
        <p>These operational terms may be updated as the platform evolves. Continued use of Neural OS after any update constitutes acceptance of the revised terms. Major changes will be surfaced via the in-platform notification system.</p>
      </Section>
    </div>
  ),
};

interface GovernanceModalProps {
  isOpen: boolean;
  initialTab?: TabId;
  onClose: () => void;
}

const GovernanceModal: React.FC<GovernanceModalProps> = ({ isOpen, initialTab = 'PRIVACY_POLICY', onClose }) => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  if (!isOpen) return null;

  const ts = new Date().toISOString();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9997] flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: 'rgba(2,11,36,0.92)', backdropFilter: 'blur(20px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-6xl h-full max-h-[85vh] flex flex-col overflow-hidden"
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid var(--theme-primary,#00d4ff)22',
              borderRadius: '2rem',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 0 100px var(--theme-primary,#00d4ff)15, inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-10 pt-10 pb-8 border-b border-white/10 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: 'var(--theme-primary,#00d4ff)', boxShadow: '0 0 12px var(--theme-primary,#00d4ff)' }} />
                  <h2 className="font-orbitron text-lg font-black tracking-[0.4em] text-white uppercase">Governance_Console</h2>
                </div>
                <p className="font-space-mono text-[9px] text-white/30 uppercase tracking-[0.3em] pl-7">
                  SYSTEM_ID :: {ts.replace('T', ' :: ').replace('Z', '')}
                </p>
              </div>
              <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 transition-all text-white/30 hover:text-white border border-white/0 hover:border-white/10 group">
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Tab Bar — Optimized Navigation */}
            <div className="flex gap-2 flex-wrap px-10 py-6 border-b border-white/[0.03] shrink-0 overflow-x-auto scrollbar-none">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl font-orbitron text-[9px] font-bold tracking-[0.2em] uppercase transition-all whitespace-nowrap border"
                    style={isActive ? {
                      background: 'var(--theme-primary,#00d4ff)15',
                      borderColor: 'var(--theme-primary,#00d4ff)44',
                      color: 'var(--theme-primary,#00d4ff)',
                      boxShadow: '0 0 20px var(--theme-primary,#00d4ff)10',
                    } : { 
                      color: 'rgba(255,255,255,0.25)', 
                      borderColor: 'transparent',
                      background: 'transparent'
                    }}
                  >
                    <Icon size={12} className={isActive ? 'opacity-100' : 'opacity-40'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Area — High Spacing */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-12 py-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <div className="max-w-4xl">
                    {CONTENT[activeTab]}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer / Telemetry */}
            <div className="flex items-center justify-between px-10 py-6 border-t border-white/[0.03] shrink-0 bg-white/[0.01]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-neon-green" />
                  <span className="font-space-mono text-[9px] text-white/30 uppercase tracking-widest">Compliance_Verified</span>
                </div>
                <span className="font-space-mono text-[9px] text-white/10 uppercase tracking-[0.5em]">Neural_OS v4.2.0</span>
              </div>
              <button onClick={onClose}
                className="px-8 py-3 rounded-xl font-orbitron text-[10px] font-black tracking-[0.2em] uppercase transition-all border border-white/10 hover:border-white/30 text-white/60 hover:text-white bg-white/5">
                Close_Console
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GovernanceModal;
export type { TabId };
