'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppUser, Student, StudentOrganization, Admin } from '@/types';
import { adminUser as adminUserObject } from '@/lib/placeholder-data';
import { v4 as uuidv4 } from 'uuid';
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';


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

// Store passwords in memory for this mock implementation
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
      
      if (userId) {
        if (userId === adminUserObject.id) {
          setUser(adminUserObject);
        } else if (firestore) {
            try {
              const userDocRef = doc(firestore, 'users', userId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                  setUser({ id: userDoc.id, ...userDoc.data() } as AppUser);
              } else {
                 localStorage.removeItem('userId');
                 setUser(null);
              }
            } catch (e) {
                console.error("Firestore-dan istifadəçi axtarılarkən xəta:", e);
                localStorage.removeItem('userId');
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
        router.push('/admin/dashboard');
        setLoading(false);
        return true;
    }

    // This is a mock for other users. In a real app, you would use Firebase Auth.
    // For now, we'll retrieve the user from Firestore to check their existence.
    // The password check is still mocked.
    if (!firestore) {
      setLoading(false);
      return false;
    }
    
    // In a real app, this logic would be handled by Firebase Auth signInWithEmailAndPassword
    // Here we just simulate it by checking if a user with that email exists.
    // This is NOT secure and for demonstration only.
    
    // A more realistic mock would involve checking against a list of users, but we are moving to live data.
    // We'll skip deep checks and assume if not admin, it's a placeholder logic.
    const MOCK_PASSWORD = "password123";
    if (pass !== MOCK_PASSWORD) {
        setLoading(false);
        return false;
    }
    
    // This part is tricky without a proper auth backend.
    // We'll assume for now that login works for any email if password is 'password123' and redirect based on role.
    // This is a temporary measure as we shift to a more live architecture.
    // A proper implementation requires actual auth. Let's find user by email.
    
    // This is a placeholder for real login logic
     setLoading(false);
     return false;

  };

  const logout = () => {
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
      console.error("Firestore servisi tapılmadı.");
      setLoading(false);
      return false;
    }
    
    const newUserId = uuidv4();
    const userWithId = {
        ...newUser,
        id: newUserId,
        createdAt: new Date(), // Use native Date object for Firestore
        status: newUser.role === 'student' ? 'gözləyir' : newUser.status,
    };

    try {
      const userDocRef = doc(firestore, 'users', newUserId);
      await setDoc(userDocRef, userWithId);
      
      // In a real app, you would use Firebase Auth `createUserWithEmailAndPassword`.
      // For this mock, we are just storing the user profile.
      passwordMap.set(newUser.email, pass);

      console.log("Yeni istifadəçi Firestore-da qeydiyyatdan keçdi:", userWithId);

      setLoading(false);
      if (!skipRedirect) {
          router.push('/login');
      }
      return true;

    } catch (error) {
        console.error("Firestore-da istifadəçi qeydiyyatı zamanı xəta:", error);
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
    
    console.log("İstifadəçi məlumatları yeniləndi (həm lokal, həm də Firestore-da):", newUserData);
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
