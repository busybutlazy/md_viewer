"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/components/ui/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Badge aria-label={`Current theme ${resolvedTheme}`} tone="outline">
        {resolvedTheme}
      </Badge>
      <div className="flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
        <Button
          aria-pressed={theme === "light"}
          className="min-h-9 px-3"
          onClick={() => setTheme("light")}
          variant={theme === "light" ? "primary" : "ghost"}
        >
          Light
        </Button>
        <Button
          aria-pressed={theme === "system"}
          className="min-h-9 px-3"
          onClick={() => setTheme("system")}
          variant={theme === "system" ? "primary" : "ghost"}
        >
          System
        </Button>
        <Button
          aria-pressed={theme === "dark"}
          className="min-h-9 px-3"
          onClick={() => setTheme("dark")}
          variant={theme === "dark" ? "primary" : "ghost"}
        >
          Dark
        </Button>
      </div>
    </div>
  );
}
