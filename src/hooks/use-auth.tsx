'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppUser, Student, StudentOrganization, Admin } from '@/types';
import { adminUser as adminUserObject } from '@/lib/placeholder-data';
import { v4 as uuidv4 } from 'uuid';
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';


interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (
    user: Omit<Student, 'id' | 'createdAt' | 'status'> | Omit<StudentOrganization, 'id' | 'createdAt'>,
    pass: string,
    skipRedirect?: boolean
  ) => Promise<boolean>;
  updateUser: (updatedData: Partial<AppUser>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_AUTH_DELAY = 10; 

// This is highly insecure and for mock purposes only.
// In a real app, you would never store passwords like this.
const passwordMap = new Map<string, string>();
passwordMap.set(adminUserObject.email, 'huseynimanov2009@thikndu');


export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    const checkUserSession = async () => {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const userPass = userId ? localStorage.getItem(`pass_${userId}`) : null;
      
      if (userId) {
        if (userId === adminUserObject.id && userPass === 'huseynimanov2009@thikndu') {
          setUser(adminUserObject);
        } else if (firestore) {
            try {
              const userDocRef = doc(firestore, 'users', userId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                  setUser({ id: userDoc.id, ...userDoc.data() } as AppUser);
              } else {
                 localStorage.removeItem('userId');
                 localStorage.removeItem(`pass_${userId}`);
                 setUser(null);
              }
            } catch (e) {
                console.error("Error fetching user from Firestore:", e);
                localStorage.removeItem('userId');
                localStorage.removeItem(`pass_${userId}`);
                setUser(null);
            }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    
    checkUserSession();
  }, [firestore]);


  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(res => setTimeout(res, FAKE_AUTH_DELAY));

    if (email === adminUserObject.email && pass === 'huseynimanov2009@thikndu') {
        setUser(adminUserObject);
        localStorage.setItem('userId', adminUserObject.id);
        localStorage.setItem(`pass_${adminUserObject.id}`, pass); // Store pass for session restore
        router.push('/admin/dashboard');
        setLoading(false);
        return true;
    }

    // In a real app, this logic would be handled by Firebase Auth signInWithEmailAndPassword.
    // This is NOT secure and for demonstration only.
    // For now, we just simulate it by checking if a user with that email exists.
    // This part is tricky without a proper auth backend, so we will remove the placeholder logic
    // and rely on a more dynamic (but still mock) approach.
    
    setLoading(false);
    return false; // Placeholder for non-admin login. Actual logic will be added back.
  };

  const logout = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      localStorage.removeItem(`pass_${userId}`);
    }
    setUser(null);
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const register = async (
    newUser: Omit<Student, 'id' | 'createdAt' | 'status'> | Omit<StudentOrganization, 'id' | 'createdAt'>,
    pass: string,
    skipRedirect = false
  ): Promise<boolean> => {
    setLoading(true);

    if (!firestore) {
      console.error("Firestore service not available.");
      setLoading(false);
      return false;
    }
    
    const newUserId = uuidv4();
    const userWithId = {
        ...newUser,
        id: newUserId,
        createdAt: Timestamp.now(), // Use Firestore Timestamp for server consistency
        status: newUser.role === 'student' ? 'gözləyir' : newUser.status,
    };

    try {
      const userDocRef = doc(firestore, 'users', newUserId);
      await setDoc(userDocRef, userWithId);
      
      // In a real app, you would use Firebase Auth `createUserWithEmailAndPassword`.
      // For this mock, we are just storing the user profile and a fake password reference.
      passwordMap.set(newUser.email, pass);

      console.log("New user registered in Firestore:", userWithId);

      setLoading(false);
      if (!skipRedirect) {
          router.push('/login');
      }
      return true;

    } catch (error) {
        console.error("Error during user registration in Firestore:", error);
        setLoading(false);
        return false;
    }
  };

  const updateUser = (updatedData: Partial<AppUser>): boolean => {
    if (!user) return false;
    
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    
    if (firestore) {
        const userDocRef = doc(firestore, 'users', user.id);
        updateDocumentNonBlocking(userDocRef, updatedData);
    }
    
    console.log("User data updated locally and in Firestore:", newUserData);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SessionProvider');
  }
  return context;
};
