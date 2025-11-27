'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppUser, Student, StudentOrganization, Admin } from '@/types';
import { allUsers } from '@/lib/placeholder-data';
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

const adminUserObject: Admin = {
    id: 'admin_user',
    role: 'admin',
    email: 'huseynimanov@ndu.edu.az',
    firstName: 'Hüseyn',
    lastName: 'Tahirov',
};

// Store passwords in memory for this mock implementation
const passwordMap = new Map<string, string>();
passwordMap.set(adminUserObject.email, 'huseynimanov2009@thikndu');
allUsers.forEach(u => passwordMap.set(u.email, 'password123'));


export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = () => {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (userId) {
        const foundUser = allUsers.find(u => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
        } else if (userId === adminUserObject.id) {
          setUser(adminUserObject);
        } else {
          localStorage.removeItem('userId');
          setUser(null);
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

    const expectedPassword = passwordMap.get(email);
    if (!expectedPassword || expectedPassword !== pass) {
        setLoading(false);
        return false;
    }
    
    const foundUser = allUsers.find(u => u.email === email);
    
    if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('userId', foundUser.id);
        
        if (foundUser.role === 'student') router.push('/student-dashboard');
        else if (foundUser.role === 'student-organization') router.push('/telebe-teskilati-paneli/dashboard');
        
        setLoading(false);
        return true;
    } else if (email === adminUserObject.email) {
        setUser(adminUserObject);
        localStorage.setItem('userId', adminUserObject.id);
        router.push('/admin/dashboard');
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

    if (allUsers.some(u => u.email === newUser.email) || passwordMap.has(newUser.email)) {
        console.log(`User with this email already exists.`);
        setLoading(false);
        return false;
    }
    
    // This is a mock, so we won't actually add the user to the placeholder file.
    // In a real scenario, this would be an API call.
    const newUserId = uuidv4();
    const userWithId = {
        ...newUser,
        id: newUserId,
        createdAt: new Date().toISOString(),
        status: newUser.role === 'student' ? 'gözləyir' : newUser.status,
    };
    
    console.log("New user registered (mock):", userWithId);
    passwordMap.set(newUser.email, pass);

    setLoading(false);

    if (!skipRedirect) {
        router.push('/login');
    }
    return true;
  };

  const updateUser = (updatedData: Partial<AppUser>): boolean => {
    if (!user) return false;
    // This is a mock. We will update the user state in the context, but it won't persist
    // in the placeholder-data.ts file. A real implementation would need an API.
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    console.log("User data updated in context (mock):", newUserData);
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
