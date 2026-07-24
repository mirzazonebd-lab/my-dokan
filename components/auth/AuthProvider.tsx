'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone?: string | null;
  role: 'admin' | 'customer';
  dark_mode?: boolean;
  email_notifications?: boolean;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'beautydokanbd_auth_token';
const PROFILE_KEY = 'beautydokanbd_profile';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = profile?.role === 'admin';

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already logged in with Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
          setToken(session.access_token);

          // Fetch user profile
          try {
            const { data: profileData, error: profileError } = await supabaseAdmin
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.warn('Profile not found:', profileError);
              // Create default profile if it doesn't exist
              const { data: newProfile } = await supabaseAdmin
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || null,
                  role: 'customer',
                })
                .select()
                .single();

              if (newProfile) {
                setProfile(newProfile as Profile);
              }
            } else if (profileData) {
              setProfile(profileData as Profile);
            }
          } catch (err) {
            console.error('Error fetching profile:', err);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
        });
        setToken(session.access_token);

        // Fetch updated profile
        try {
          const { data: profileData } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData as Profile);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
        setToken(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (!email || !email.includes('@')) {
        return { error: new Error('Invalid email format') };
      }
      if (!password || password.length < 6) {
        return { error: new Error('Password must be at least 6 characters') };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });

        // Profile will be auto-created by trigger
        const newProfile: Profile = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: fullName || null,
          role: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(newProfile);
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!email || !email.includes('@')) {
        return { error: new Error('Invalid email format') };
      }
      if (!password) {
        return { error: new Error('Password is required') };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
        });
        setToken(data.session.access_token);

        // Fetch user profile
        try {
          const { data: profileData } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData as Profile);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setToken(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      // Filter out fields that shouldn't be sent to the database
      const allowedFields = ['full_name', 'phone', 'dark_mode', 'email_notifications'] as const;
      const filteredUpdates: Record<string, any> = {};
      
      for (const key in updates) {
        if (allowedFields.includes(key as typeof allowedFields[number])) {
          filteredUpdates[key] = updates[key as keyof Profile];
        }
      }

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(filteredUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error };
      }

      if (data) {
        setProfile(data as Profile);
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      token,
      loading,
      isAdmin,
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
  if (context === undefined) {
    return {
      user: null,
      profile: null,
      token: null,
      loading: true,
      isAdmin: false,
      signUp: async () => ({ error: new Error('Auth context not available') }),
      signIn: async () => ({ error: new Error('Auth context not available') }),
      signOut: async () => {},
      updateProfile: async () => ({ error: new Error('Auth context not available') }),
    };
  }
  return context;
}
