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
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // Listen for auth changes
  const supabase = createClient();

  // Check initial auth state
  supabase.auth.getUser().then(({ data, error }) => {
    if (error) {
      setError(error);
      setIsLoggedIn(false);
      setUser(null);
    } else {
      // Check if we got a user
      const loggedIn = !!data?.user;
      setIsLoggedIn(loggedIn);
      setUser(data?.user || null);
      setError(null);
    }
  });
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUser(null);
      } else if (_event === "SIGNED_IN") {
        setIsLoggedIn(true);
        setUser(session?.user || null);
      }
      setError(null);
    });
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

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
