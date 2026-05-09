import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface SystemPreferences {
  theme: string;
  aiMode: string;
  glowIntensity: number;
  telemetryDensity: number;
  audioEnabled: boolean;
  responseLength: string;
  cinematicMode: boolean;
  masterVolume: number;
  hoverSound: boolean;
  startupSound: boolean;
  typingSound: boolean;
  cognitionDepth: string;
  realtimeProcessing: boolean;
  motionEnabled: boolean;
  transparencyEnabled: boolean;
}

export const defaultPreferences: SystemPreferences = {
  theme: 'CYAN_CORE',
  aiMode: 'GEMINI_1.5_PRO',
  glowIntensity: 50,
  telemetryDensity: 80,
  audioEnabled: true,
  responseLength: 'DYNAMIC',
  cinematicMode: true,
  masterVolume: 70,
  hoverSound: true,
  startupSound: true,
  typingSound: true,
  cognitionDepth: 'DEEP',
  realtimeProcessing: true,
  motionEnabled: true,
  transparencyEnabled: true
};

export const getUserPreferences = async (uid: string): Promise<SystemPreferences> => {
  if (!uid) throw new Error("No user ID provided");
  
  const prefRef = doc(db, 'users', uid, 'preferences', 'system');
  const snap = await getDoc(prefRef);
  
  if (snap.exists()) {
    return snap.data() as SystemPreferences;
  } else {
    // Initialize default preferences
    await setDoc(prefRef, defaultPreferences);
    return defaultPreferences;
  }
};

export const updateUserPreferences = async (uid: string, updates: Partial<SystemPreferences>) => {
  if (!uid) throw new Error("No user ID provided");
  
  const prefRef = doc(db, 'users', uid, 'preferences', 'system');
  await updateDoc(prefRef, updates);
};
