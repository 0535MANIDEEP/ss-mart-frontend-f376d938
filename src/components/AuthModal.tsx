
import { useRef, useEffect, useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, LogIn, UserPlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  mode: "login" | "signup" | null;
  onClose: () => void;
};

const AuthModal = ({ open, mode, onClose }: Props) => {
  const { signUp, signIn, loading, user } = useSupabaseAuth();
  const [activeMode, setActiveMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState(""); // Used for display only, not persisted (unless you extend the profile schema)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setActiveMode(mode || "login");
      setName("");
      setEmail("");
      setPassword("");
      setFormError(null);
      setSuccessMsg(null);
      setFormLoading(false);
      // focus on open
      setTimeout(() => firstInputRef.current?.focus(), 150);
    }
  }, [open, mode]);

  // Auto-close modal on login
  useEffect(() => {
    if (user && open) {
      onClose();
      setTimeout(() => {
        navigate("/home");
      }, 100); // give time for modal to animate out
    }
  }, [user, open, onClose, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    setFormLoading(true);

    if (activeMode === "signup") {
      const { error } = await signUp(email, password);
      setFormLoading(false);
      if (error) {
        setFormError(error);
      } else {
        setSuccessMsg("Signup successful! Please check your email to verify your account.");
      }
    } else {
      const { error } = await signIn(email, password);
      setFormLoading(false);
      if (error) {
        setFormError(error);
      } else {
        setSuccessMsg("Login successful!");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v ? onClose() : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            {activeMode === "signup" ? <UserPlus /> : <LogIn />}
            {activeMode === "signup" ? "Sign Up" : "Login"}
          </DialogTitle>
          <DialogDescription>
            {activeMode === "signup"
              ? "Sign up to access reviews and order history. Check your email for verification."
              : "Welcome back! Login to place orders and manage your account."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-1 mb-4">
          <Button
            size="sm"
            variant={activeMode === "login" ? "default" : "outline"}
            onClick={() => setActiveMode("login")}
            className="flex items-center gap-1"
            disabled={formLoading}
          >
            <LogIn className="size-4" /> Login
          </Button>
          <Button
            size="sm"
            variant={activeMode === "signup" ? "default" : "outline"}
            onClick={() => setActiveMode("signup")}
            className="flex items-center gap-1"
            disabled={formLoading}
          >
            <UserPlus className="size-4" /> Sign Up
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeMode === "signup" && (
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                disabled={formLoading}
                ref={firstInputRef}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={formLoading}
              ref={activeMode === "signup" ? undefined : firstInputRef}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete={activeMode === "signup" ? "new-password" : "current-password"}
              disabled={formLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={formLoading || !email || !password || (activeMode === "signup" && !name)}
            className="w-full flex items-center justify-center gap-2"
          >
            {formLoading && <LoaderCircle className="animate-spin size-4" />}
            {activeMode === "signup" ? <UserPlus className="size-4" /> : <LogIn className="size-4" />}
            {activeMode === "signup" ? "Sign Up" : "Login"}
          </Button>
        </form>
        {formError && <div className="text-red-600 font-medium text-sm mt-2">{formError}</div>}
        {successMsg && (
          <div className="text-green-700 font-medium text-sm mt-2">{successMsg}</div>
        )}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 transition"
        >
          <X className="size-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
