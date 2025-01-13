"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  error: Error | null;
  setIsLoggedIn: (value: boolean) => void;
  supabase: ReturnType<typeof createClient>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null | undefined>(undefined); // Change initial state to undefined
  const [error, setError] = useState<Error | null>(null);
  const [supabase] = useState(() => createClient()); // Memoize supabase client

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const checkSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError);
        setIsLoggedIn(false);
        setUser(null);
        return false;
      } else if (session?.user) {
        setIsLoggedIn(true);
        setUser(session.user);
        setError(null);
        return true;
      }
      return false;
    };

    // Initial check
    checkSession().then((hasUser) => {
      // If no user found, start interval
      if (!hasUser) {
        interval = setInterval(async () => {
          const found = await checkSession();
          if (found && interval) {
            clearInterval(interval);
          }
        }, 1000); // Check every second
      }
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session?.user);
      setUser(session?.user || null);
      setError(null);

      // Clear interval if it exists when user is found
      if (session?.user && interval) {
        clearInterval(interval);
      }
    });

    // Cleanup subscription
    return () => {
      if (interval) clearInterval(interval);
      subscription.unsubscribe();
    };
  }, [supabase.auth]); // Only depend on supabase.auth

  // Show nothing while initial check is happening
  if (user === undefined) {
    return null;
  }

  const value = {
    isLoggedIn,
    user,
    error,
    setIsLoggedIn,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
