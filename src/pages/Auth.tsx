
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { LoaderCircle, User, UserPlus, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Auth = () => {
  const { user, loading, signUp, signIn, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setMsg(null);

    if (mode === "signup") {
      const { error } = await signUp(email, password);
      setFormLoading(false);
      if (error) {
        setFormError(error);
      } else {
        setMsg("Signup successful! Check your email for the confirmation link.");
      }
    } else {
      const { error } = await signIn(email, password);
      setFormLoading(false);
      if (error) {
        setFormError(error);
      } else {
        setMsg("Welcome back!");
        navigate("/");
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin size-12 text-green-600" />
      </div>
    );

  return (
    <div className="max-w-md w-full mx-auto mt-20 px-4 py-8 bg-white dark:bg-gray-900 shadow-lg rounded-md animate-fade-in">
      <div className="flex justify-center mb-6">
        <span className="text-3xl font-black text-green-700 dark:text-lux-gold flex items-center gap-2">
          <User className="stroke-2" size={32} /> SSMART Account
        </span>
      </div>
      <div className="mb-5 flex justify-center gap-4">
        <Button
          size="sm"
          variant={mode === "login" ? "default" : "outline"}
          onClick={() => setMode("login")}
          className="flex items-center gap-1"
        >
          <LogIn className="size-4" /> Login
        </Button>
        <Button
          size="sm"
          variant={mode === "signup" ? "default" : "outline"}
          onClick={() => setMode("signup")}
          className="flex items-center gap-1"
        >
          <UserPlus className="size-4" /> Signup
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <Input
            type="email"
            required
            autoComplete="email"
            disabled={formLoading}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <Input
            type="password"
            required
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            disabled={formLoading}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </div>
        <Button
          type="submit"
          disabled={formLoading || !email || !password}
          className="w-full flex items-center justify-center gap-2"
        >
          {formLoading ? <LoaderCircle className="animate-spin size-4" /> : null}
          {mode === "signup" ? <UserPlus className="size-4" /> : <LogIn className="size-4" />}
          {mode === "signup" ? "Sign Up" : "Login"}
        </Button>
        {formError && <div className="text-red-600 font-medium text-sm">{formError}</div>}
        {msg && <div className="text-green-700 font-medium text-sm">{msg}</div>}
      </form>
      {user && (
        <div className="mt-4 flex flex-col items-center">
          <div className="text-sm">Logged in as {user.email}</div>
          <Button onClick={signOut} variant="outline" className="mt-2"><LogOut className="size-4" /> Logout</Button>
        </div>
      )}
    </div>
  );
};

export default Auth;
