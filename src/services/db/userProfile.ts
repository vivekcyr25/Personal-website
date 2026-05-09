import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface UserProfile {
  codename: string;
  displayName: string;
  timezone: string;
  language: string;
  notificationsEnabled: boolean;
}

export const defaultProfile: UserProfile = {
  codename: 'UNASSIGNED',
  displayName: 'ANONYMOUS',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  language: 'EN-US',
  notificationsEnabled: true
};

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  if (!uid) throw new Error("No user ID provided");
  
  const profileRef = doc(db, 'users', uid, 'profile', 'data');
  const snap = await getDoc(profileRef);
  
  if (snap.exists()) {
    return snap.data() as UserProfile;
  } else {
    await setDoc(profileRef, defaultProfile);
    return defaultProfile;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  if (!uid) throw new Error("No user ID provided");
  
  const profileRef = doc(db, 'users', uid, 'profile', 'data');
  await updateDoc(profileRef, updates);
};
