import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  hasIdentity: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  refreshIdentity: () => Promise<void>;
  showToast: (message: string, type?: 'error' | 'success') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasIdentity, setHasIdentity] = useState(false);
  
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await syncUserToFirestore(currentUser);
      } else {
        setUser(null);
        setUserData(null);
        setHasIdentity(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserToFirestore = async (currentUser: User) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const initialData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || 'ANONYMOUS',
          photoURL: currentUser.photoURL || '',
          createdAt: serverTimestamp(),
          hasIdentity: false
        };
        await setDoc(userRef, initialData);
        setUserData(initialData);
        setHasIdentity(false);
      } else {
        const data = userSnap.data();
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        setUserData(data);
        setHasIdentity(!!data.hasIdentity);
      }
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        showToast('NEURAL UPLINK DENIED: Insufficient Security Clearances', 'error');
      } else {
        showToast('SYSTEM SYNC ERROR: ' + error.message, 'error');
      }
    }
  };

  const refreshIdentity = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setHasIdentity(!!data.hasIdentity);
        }
      } catch (error: any) {
        showToast('FAILED TO REFRESH IDENTITY', 'error');
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Wait for onAuthStateChanged to pick this up, don't double sync here
      showToast('OAUTH SUCCESS: Handshake accepted', 'success');
    } catch (error: any) {
      showToast('OAUTH FAILED: ' + error.message, 'error');
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      showToast('OAUTH SUCCESS: Handshake accepted', 'success');
    } catch (error: any) {
      showToast('OAUTH FAILED: ' + error.message, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast('SESSION TERMINATED', 'success');
    } catch (error: any) {
      showToast('TERMINATION FAILED: ' + error.message, 'error');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      hasIdentity, 
      loginWithGoogle, 
      loginWithGithub, 
      logout,
      refreshIdentity,
      showToast
    }}>
      {children}
      
      {/* Cinematic Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-xl border flex items-center gap-4 backdrop-blur-xl shadow-2xl ${
              toast.type === 'error' 
                ? 'bg-theme-accent/10 border-theme-accent/50 text-theme-accent shadow-[0_0_30px_rgba(var(--theme-accent-rgb),0.3)]' 
                : 'bg-theme-secondary/10 border-theme-secondary/50 text-theme-secondary shadow-[0_0_30px_rgba(var(--theme-secondary-rgb),0.3)]'
            }`}
          >
            {toast.type === 'error' ? <ShieldAlert size={20} className="animate-pulse" /> : <CheckCircle size={20} />}
            <div>
              <p className="font-orbitron font-bold text-[10px] tracking-widest uppercase">
                {toast.type === 'error' ? 'SYSTEM_ALERT' : 'SYSTEM_NOTICE'}
              </p>
              <p className="font-space-mono text-[10px] tracking-wider opacity-80 mt-1">
                {toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
