"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/components/ui/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Badge
        aria-label={isMounted ? `Current theme ${resolvedTheme}` : "Theme loading"}
        tone="outline"
      >
        {isMounted ? resolvedTheme : "theme"}
      </Badge>
      <div className="flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
        <Button
          aria-pressed={isMounted && theme === "light"}
          className="min-h-9 px-3"
          onClick={() => setTheme("light")}
          variant={isMounted && theme === "light" ? "primary" : "ghost"}
        >
          Light
        </Button>
        <Button
          aria-pressed={isMounted && theme === "system"}
          className="min-h-9 px-3"
          onClick={() => setTheme("system")}
          variant={isMounted && theme === "system" ? "primary" : "ghost"}
        >
          System
        </Button>
        <Button
          aria-pressed={isMounted && theme === "dark"}
          className="min-h-9 px-3"
          onClick={() => setTheme("dark")}
          variant={isMounted && theme === "dark" ? "primary" : "ghost"}
        >
          Dark
        </Button>
      </div>
    </div>
  );
}
