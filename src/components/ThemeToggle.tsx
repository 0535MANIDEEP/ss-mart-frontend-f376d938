
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Load preferred theme
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      const sys = getSystemTheme();
      setTheme(sys);
      document.documentElement.classList.toggle("dark", sys === "dark");
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="rounded-full focus-visible:ring-2 focus-visible:ring-ssblue-accent bg-ssblue-secondary/20 hover:bg-ssblue-accent/30 text-ssblue-onblue dark:bg-ssblue-accent/20 dark:hover:bg-ssblue-accent/40 dark:text-ssblue-onblue transition-all"
      tabIndex={0}
    >
      {theme === "dark" ? (
        <Sun aria-label="Light Mode" className="h-5 w-5" />
      ) : (
        <Moon aria-label="Dark Mode" className="h-5 w-5" />
      )}
    </Button>
  );
}
