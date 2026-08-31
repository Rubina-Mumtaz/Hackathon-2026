import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuthState = async (currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setProfile(null);
      setRole(null);

      if (!currentSession?.user) return;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();

      if (error) throw error;

      setProfile(profileData);
      setRole(profileData?.role ?? null);
    };

    const loadSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        await syncAuthState(currentSession);
      } catch (error) {
        console.error('Unable to load the user profile:', error);
        setProfile(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setLoading(true);
      try {
        await syncAuthState(currentSession);
      } catch (error) {
        console.error('Unable to load the user profile:', error);
        setProfile(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, full_name, role, category, experience, price, location }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
          category: category || null,
          experience: experience || null,
          price: price || null,
          location: location || null,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name,
        role,
        category: category || null,
        experience: experience || null,
        price: price || null,
        location: location || null,
      });

      if (profileError) throw profileError;
    }

    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      role,
      loading,
      signUp,
      signIn,
      signOut,
      isAuthenticated: !!user,
    }),
    [session, user, profile, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
