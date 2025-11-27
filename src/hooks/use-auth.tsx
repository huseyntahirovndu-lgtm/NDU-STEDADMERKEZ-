'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppUser, Student, StudentOrganization, Admin } from '@/types';
import { allUsers as placeholderUsers, adminUser as adminUserObject } from '@/lib/placeholder-data';
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

// Placeholder istifadəçilər üçün parolları yüklə
placeholderUsers.forEach(u => {
    if (u && u.email) {
        passwordMap.set(u.email, 'password123'); // Bütün saxta istifadəçilər üçün standart parol
    }
});


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
        } else {
          // Öncə lokal məlumatlardan tapmağa çalış
          let foundUser: AppUser | undefined = placeholderUsers.find(u => u && u.id === userId);
          
          // Əgər lokalda tapılmazsa, Firestore-dan axtar (yeni qeydiyyatlar üçün)
          if (!foundUser && firestore) {
              try {
                const userDocRef = doc(firestore, 'users', userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    foundUser = { id: userDoc.id, ...userDoc.data() } as AppUser;
                }
              } catch (e) {
                  console.error("Firestore-dan istifadəçi axtarılarkən xəta:", e);
              }
          }

          if (foundUser) {
            setUser(foundUser);
          } else {
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

    // Admin girişi
    if (email === adminUserObject.email && pass === 'huseynimanov2009@thikndu') {
        setUser(adminUserObject);
        localStorage.setItem('userId', adminUserObject.id);
        router.push('/admin/dashboard');
        setLoading(false);
        return true;
    }

    const expectedPassword = passwordMap.get(email);
    
    if (!expectedPassword || expectedPassword !== pass) {
        setLoading(false);
        return false; // Yanlış parol
    }
    
    let foundUser: AppUser | undefined = placeholderUsers.find(u => u && u.email === email);

    // Yeni qeydiyyatdan keçmiş istifadəçiləri də yoxla (adətən bu login-dən sonra yox, sessiya yoxlamasında olur, amma ehtiyat üçün)
    if (!foundUser) {
        // Bu hissə adətən real autentikasiya ilə idarə olunur, saxta parol yoxlaması ilə birləşdirmək mürəkkəbdir.
        // Hələlik yalnız lokal məlumatlara əsaslanırıq.
    }
    
    if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('userId', foundUser.id);
        
        if (foundUser.role === 'student') router.push('/student-dashboard');
        else if (foundUser.role === 'student-organization') router.push('/telebe-teskilati-paneli/dashboard');
        
        setLoading(false);
        return true;
    }

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
    
    // E-poçtun mövcudluğunu yoxla (həm lokal, həm də potensial olaraq firestore)
    if (placeholderUsers.some(u => u && u.email === newUser.email) || passwordMap.has(newUser.email)) {
        console.log(`Bu e-poçt ilə istifadəçi artıq mövcuddur.`);
        setLoading(false);
        return false;
    }
    
    const newUserId = uuidv4();
    const userWithId = {
        ...newUser,
        id: newUserId,
        createdAt: new Date().toISOString(), // ISO string formatında saxlayaq
        status: newUser.role === 'student' ? 'gözləyir' : newUser.status,
    };

    try {
      // Məlumatları Firestore-a yaz
      const userDocRef = doc(firestore, 'users', newUserId);
      await setDoc(userDocRef, userWithId);
      
      // Parolu yadda saxla (real tətbiqdə bu Firebase Auth ilə olmalıdır)
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
    
    // Lokal state-i yenilə
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    
    // Dəyişiklikləri Firestore-a da yaz (əgər varsa)
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
