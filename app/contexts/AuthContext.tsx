// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { USERS_DB, generateMockToken } from '@/lib/staticData';
// import { 
//   getStoredUser, 
//   setStoredUser, 
//   getStoredToken, 
//   setStoredToken, 
//   clearAuth,
//   initializeStorage,
//   updateUserStreak
// } from '@/lib/storage';
// import type { User } from '@/types';

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   isAuth: boolean;
//   login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
//   register: (email: string, password: string, primary_mentor: string) => Promise<{ success: boolean; error?: string }>;
//   logout: () => Promise<void>;
//   refreshUser: () => void;
//   updateUser: (updates: Partial<User>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuth, setIsAuth] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     initializeStorage();
//     const storedUser = getStoredUser();
//     const storedToken = getStoredToken();
    
//     if (storedUser && storedToken) {
//       setUser(storedUser);
//       setIsAuth(true);
//       updateUserStreak();
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     const userRecord = USERS_DB[email.toLowerCase()];
    
//     if (!userRecord || userRecord.password !== password) {
//       return { success: false, error: 'Invalid credentials' };
//     }

//     const { password: _, ...userData } = userRecord;
//     const token = generateMockToken(userData.id);
    
//     setStoredToken(token);
//     setStoredUser(userData);
//     setUser(userData);
//     setIsAuth(true);
    
//     toast.success('Welcome back!');
    
//     if (!userData.primary_mentor) {
//       router.push('/selection-hall');
//     } else {
//       router.push('/hall');
//     }
    
//     return { success: true };
//   };

//   const register = async (email: string, password: string, primary_mentor: string) => {
//     if (USERS_DB[email.toLowerCase()]) {
//       return { success: false, error: 'Email already registered' };
//     }

//     const newUser: User = {
//       id: Object.keys(USERS_DB).length + 1,
//       email: email.toLowerCase(),
//       primary_mentor: primary_mentor as any,
//       current_rank: 'Initiate',
//       influence_xp: 0,
//       streak_days: 0,
//       subscription_status: 'free',
//       timezone: 'UTC',
//       last_activity_date: new Date().toISOString().split('T')[0],
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     };

//     USERS_DB[email.toLowerCase()] = { ...newUser, password };
//     const token = generateMockToken(newUser.id);
    
//     setStoredToken(token);
//     setStoredUser(newUser);
//     setUser(newUser);
//     setIsAuth(true);
    
//     toast.success('Account created successfully!');
//     router.push('/hall');
    
//     return { success: true };
//   };

//   const logout = async () => {
//     clearAuth();
//     setUser(null);
//     setIsAuth(false);
//     toast.success('Logged out successfully');
//     router.push('/auth/login');
//   };

//   const refreshUser = () => {
//     const storedUser = getStoredUser();
//     if (storedUser) {
//       setUser(storedUser);
//     }
//   };

//   const updateUser = (updates: Partial<User>) => {
//     if (!user) return;
    
//     const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
//     setUser(updatedUser);
//     setStoredUser(updatedUser);
    
//     // Update in USERS_DB too
//     if (USERS_DB[user.email]) {
//       const { password } = USERS_DB[user.email];
//       USERS_DB[user.email] = { ...updatedUser, password };
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     loading,
//     isAuth,
//     login,
//     register,
//     logout,
//     refreshUser,
//     updateUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }


'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { USERS_DB, generateMockToken } from '../../lib/staticData';
import { 
  getStoredUser, 
  setStoredUser, 
  getStoredToken, 
  setStoredToken, 
  clearAuth,
  initializeStorage,
  updateUserStreak
} from '../../lib/storage';
import type { User } from '../../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, primary_mentor: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initializeStorage();
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setIsAuth(true);
      updateUserStreak();
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const userRecord = USERS_DB[email.toLowerCase()];
    
    if (!userRecord || userRecord.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }

    const { password: _, ...userData } = userRecord;
    const token = generateMockToken(userData.id);
    
    setStoredToken(token);
    setStoredUser(userData);
    setUser(userData);
    setIsAuth(true);
    
    toast.success('Welcome back!');
    
    if (!userData.primary_mentor) {
      router.push('/selection-hall');
    } else {
      router.push('/hall');
    }
    
    return { success: true };
  };

  const register = async (email: string, password: string, primary_mentor: string) => {
    if (USERS_DB[email.toLowerCase()]) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: User = {
      id: Object.keys(USERS_DB).length + 1,
      email: email.toLowerCase(),
      primary_mentor: primary_mentor as any,
      current_rank: 'Initiate',
      influence_xp: 0,
      streak_days: 0,
      subscription_status: 'free',
      timezone: 'UTC',
      last_activity_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    USERS_DB[email.toLowerCase()] = { ...newUser, password };
    const token = generateMockToken(newUser.id);
    
    setStoredToken(token);
    setStoredUser(newUser);
    setUser(newUser);
    setIsAuth(true);
    
    toast.success('Account created successfully!');
    router.push('/hall');
    
    return { success: true };
  };

  const logout = async () => {
    clearAuth();
    setUser(null);
    setIsAuth(false);
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const refreshUser = () => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updatedUser);
    setStoredUser(updatedUser);
    
    // Update in USERS_DB too
    if (USERS_DB[user.email]) {
      const { password } = USERS_DB[user.email];
      USERS_DB[user.email] = { ...updatedUser, password };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuth,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}