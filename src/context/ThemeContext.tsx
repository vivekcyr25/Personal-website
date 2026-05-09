import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SystemPreferences, defaultPreferences } from '../services/db/userPreferences';
import { MotionConfig } from 'framer-motion';

// Theme map defined outside component — never recreated
const THEME_MAP: Record<string, { primary: string; secondary: string; accent: string; bg: string; text: string; border: string }> = {
  'CYAN_CORE':      { primary: '#00d4ff', secondary: '#00ff88', accent: '#ff006e', bg: '#020b24', text: '#ffffff', border: 'rgba(255,255,255,0.1)' },
  'EMERALD_MATRIX': { primary: '#00ff88', secondary: '#00d4ff', accent: '#ffee00', bg: '#021810', text: '#e0fff0', border: 'rgba(0,255,136,0.1)' },
  'MAGENTA_SYNTH':  { primary: '#ff006e', secondary: '#9d00ff', accent: '#00d4ff', bg: '#1a0110', text: '#fff0f5', border: 'rgba(255,0,110,0.1)' },
  'VIOLET_NEURAL':  { primary: '#9d00ff', secondary: '#ff006e', accent: '#00ff88', bg: '#0f021a', text: '#f5f0ff', border: 'rgba(157,0,255,0.1)' },
};

function applyThemeVars(prefs: SystemPreferences) {
  const root = document.documentElement;
  const t = THEME_MAP[prefs.theme] ?? THEME_MAP['CYAN_CORE'];

  // Helper to convert hex to RGB for dynamic opacity
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Colors
  root.style.setProperty('--theme-primary',   t.primary);
  root.style.setProperty('--theme-secondary', t.secondary);
  root.style.setProperty('--theme-accent',    t.accent);
  root.style.setProperty('--theme-bg',        t.bg);
  root.style.setProperty('--theme-text',      t.text);
  root.style.setProperty('--theme-border',    t.border);
  root.style.setProperty('--theme-primary-rgb', hexToRgb(t.primary));
  root.style.setProperty('--theme-secondary-rgb', hexToRgb(t.secondary));
  root.style.setProperty('--theme-accent-rgb', hexToRgb(t.accent));

  // Glow
  const g = prefs.glowIntensity / 100;
  root.style.setProperty('--glow-opacity', (g * 0.5).toString());
  root.style.setProperty('--glow-blur',    `${g * 30}px`);
  root.style.setProperty('--glow-spread',  `${g * 10}px`);

  // Glass
  if (prefs.transparencyEnabled) {
    root.style.setProperty('--glass-bg',     'rgba(0, 0, 0, 0.4)');
    root.style.setProperty('--glass-blur',   '24px');
    root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
  } else {
    root.style.setProperty('--glass-bg',     'rgba(2, 11, 36, 0.95)');
    root.style.setProperty('--glass-blur',   '0px');
    root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.05)');
  }
}

interface ThemeContextType {
  prefs: SystemPreferences;
  applyLocalPref: (field: keyof SystemPreferences, value: any) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [prefs, setPrefs] = useState<SystemPreferences>(() => {
    const saved = localStorage.getItem('os-system-prefs');
    const p = saved ? (JSON.parse(saved) as SystemPreferences) : defaultPreferences;
    // Apply immediately before first paint
    applyThemeVars(p);
    return p;
  });

  // Subscribe to Firestore live updates
  useEffect(() => {
    if (!user) return;

    const prefRef = doc(db, 'users', user.uid, 'preferences', 'system');
    const unsub = onSnapshot(prefRef, (snap) => {
      if (snap.exists()) {
        const newPrefs = { ...defaultPreferences, ...(snap.data() as SystemPreferences) };
        setPrefs(newPrefs);
        localStorage.setItem('os-system-prefs', JSON.stringify(newPrefs));
        applyThemeVars(newPrefs);
      }
    }, (err) => {
      console.warn("NEURAL_SYNC_OFFLINE: Handshake restricted by firewall.", err.message);
    });

    return () => unsub();
  }, [user]);

  // Allow Config.tsx to apply local changes optimistically (before Firestore write)
  const applyLocalPref = useCallback((field: keyof SystemPreferences, value: any) => {
    setPrefs(prev => {
      const next = { ...prev, [field]: value };
      applyThemeVars(next);
      localStorage.setItem('os-system-prefs', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ prefs, applyLocalPref }}>
      <MotionConfig transition={{ duration: prefs.motionEnabled ? undefined : 0 }}>
        {children}
      </MotionConfig>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
