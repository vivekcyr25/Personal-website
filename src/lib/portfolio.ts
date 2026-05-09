import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface PortfolioData {
  id?: string;
  userId: string;
  name: string;
  theme: string;
  heroTitle: string;
  heroSub: string;
  aboutText: string;
  createdAt: any;
  updatedAt: any;
}

export const createPortfolio = async (userId: string, data: Partial<PortfolioData>) => {
  try {
    const docRef = await addDoc(collection(db, 'portfolios'), {
      userId,
      name: data.name || 'New Portfolio',
      theme: data.theme || 'cyberpunk',
      heroTitle: data.heroTitle || 'AI Systems Architect',
      heroSub: data.heroSub || 'Neural OS Environment',
      aboutText: data.aboutText || 'Autonomous agent interface...',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating portfolio:", error);
    throw error;
  }
};

export const getUserPortfolios = async (userId: string) => {
  const q = query(collection(db, 'portfolios'), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioData));
};

export const updatePortfolio = async (portfolioId: string, data: Partial<PortfolioData>) => {
  const docRef = doc(db, 'portfolios', portfolioId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deletePortfolio = async (portfolioId: string) => {
  await deleteDoc(doc(db, 'portfolios', portfolioId));
};

export const getPortfolioById = async (id: string) => {
  const docRef = doc(db, 'portfolios', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as PortfolioData;
  }
  return null;
};

export const duplicatePortfolio = async (userId: string, portfolio: PortfolioData) => {
  const { id, createdAt, updatedAt, ...rest } = portfolio;
  return await createPortfolio(userId, {
    ...rest,
    name: `${rest.name}_CLONE`
  });
};
