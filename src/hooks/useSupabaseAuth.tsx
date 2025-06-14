
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Augment the AuthContext to include user role and loading state
type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: string;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility: fetch user's top role (if admin, show admin; if user, show user; else guest)
async function fetchUserRole(userId: string): Promise<string> {
  if (!userId) return "guest";
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (error || !data || data.length === 0) return "guest";
  // Prefer admin if present
  const roles = data.map(r => (typeof r.role === "string" ? r.role : ""));
  if (roles.includes("admin")) return "admin";
  if (roles.includes("user")) return "user";
  return "guest";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string>("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Set up auth state listener before getting session
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // 2. Then check for existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // On user change, get the latest role
  useEffect(() => {
    let alive = true;
    if (user) {
      setLoading(true);
      fetchUserRole(user.id)
        .then(r => {
          if (alive) setRole(r);
        })
        .finally(() => {
          if (alive) setLoading(false);
        });
    } else {
      setRole("guest");
    }
    return () => {
      alive = false;
    };
  }, [user]);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/auth`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl }
    });
    setLoading(false);
    if (!error) return { error: null };
    return { error: error.message };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (!error) return { error: null };
    return { error: error.message };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole("guest");
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSupabaseAuth must be used inside AuthProvider");
  return ctx;
}
