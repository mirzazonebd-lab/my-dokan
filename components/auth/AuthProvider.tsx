'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Profile, DEMO_USER } from '@/lib/demo-data';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'beautydokanbd_auth';
const PROFILE_KEY = 'beautydokanbd_profile';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth state from localStorage
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    const storedProfile = localStorage.getItem(PROFILE_KEY);

    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
        setProfile(storedProfile ? JSON.parse(storedProfile) : { ...DEMO_USER, email: authData.user.email });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PROFILE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Demo signup - always succeeds
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
      };

      const newProfile: Profile = {
        ...DEMO_USER,
        id: newUser.id,
        email,
        full_name: fullName || null,
      };

      setUser(newUser);
      setProfile(newProfile);

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser }));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Demo signin - always succeeds with any credentials
      const existingUser: User = {
        id: DEMO_USER.id,
        email,
      };

      const existingProfile: Profile = {
        ...DEMO_USER,
        email,
      };

      setUser(existingUser);
      setProfile(existingProfile);

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: existingUser }));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(existingProfile));

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_KEY);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const updatedProfile = { ...profile, ...updates } as Profile;
      setProfile(updatedProfile);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // During SSR, context will be undefined - return a default safe state
  if (context === undefined) {
    return {
      user: null,
      profile: null,
      loading: true,
      signUp: async () => ({ error: null }),
      signIn: async () => ({ error: null }),
      signOut: async () => {},
      updateProfile: async () => ({ error: null }),
    };
  }
  return context;
}
