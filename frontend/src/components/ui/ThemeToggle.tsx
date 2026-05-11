"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/ui/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
      <Button
        aria-pressed={isMounted && theme === "light"}
        className="min-h-9 rounded-full px-3"
        onClick={() => setTheme("light")}
        variant={isMounted && theme === "light" ? "primary" : "ghost"}
      >
        Light
      </Button>
      <Button
        aria-pressed={isMounted && theme === "system"}
        className="min-h-9 rounded-full px-3"
        onClick={() => setTheme("system")}
        variant={isMounted && theme === "system" ? "primary" : "ghost"}
      >
        System
      </Button>
      <Button
        aria-pressed={isMounted && theme === "dark"}
        className="min-h-9 rounded-full px-3"
        onClick={() => setTheme("dark")}
        variant={isMounted && theme === "dark" ? "primary" : "ghost"}
      >
        Dark
      </Button>
    </div>
  );
}
