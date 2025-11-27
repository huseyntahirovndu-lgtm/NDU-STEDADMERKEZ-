'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppUser, Student, StudentOrganization, Admin } from '@/types';
import { allUsers as placeholderUsers, adminUser as adminUserObject } from '@/lib/placeholder-data';
import { v4 as uuidv4 } from 'uuid';


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
// Initialize passwords for placeholder users
placeholderUsers.forEach(u => {
    if (u && u.email) {
        passwordMap.set(u.email, 'password123'); // Default password for all mock users
    }
});


export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = () => {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (userId) {
        if (userId === adminUserObject.id) {
          setUser(adminUserObject);
        } else {
          const foundUser = placeholderUsers.find(u => u && u.id === userId);
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
  }, []);


  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(res => setTimeout(res, FAKE_AUTH_DELAY));

     // Admin check
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
        return false;
    }
    
    const foundUser = placeholderUsers.find(u => u && u.email === email);
    
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
     await new Promise(res => setTimeout(res, FAKE_AUTH_DELAY));

    if (placeholderUsers.some(u => u && u.email === newUser.email) || passwordMap.has(newUser.email)) {
        console.log(`User with this email already exists.`);
        setLoading(false);
        return false;
    }
    
    const newUserId = uuidv4();
    const userWithId = {
        ...newUser,
        id: newUserId,
        createdAt: new Date().toISOString(),
        status: newUser.role === 'student' ? 'gözləyir' : newUser.status,
    };
    
    console.log("New user registered (mock - will not be persisted):", userWithId);
    // In a real app, you would now send this to your backend to save.
    // For this mock setup, it won't be added to the placeholder data.
    passwordMap.set(newUser.email, pass);

    setLoading(false);

    if (!skipRedirect) {
        router.push('/login');
    }
    return true;
  };

  const updateUser = (updatedData: Partial<AppUser>): boolean => {
    if (!user) return false;
    
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
     // In a real app, you would send this update to your backend.
    // For the mock setup, we can log it.
    console.log("User data updated in context (mock - not persisted):", newUserData);
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
