"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ToastItem {
  description: string;
  id: number;
  title: string;
}

interface ToastContextValue {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      pushToast: (toast) => {
        const item = { ...toast, id: Date.now() + Math.floor(Math.random() * 1000) };
        setItems((current) => [...current, item]);
        window.setTimeout(() => {
          setItems((current) => current.filter((entry) => entry.id !== item.id));
        }, 2800);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3"
      >
        {items.map((item) => (
          <section
            className={cn(
              "pointer-events-auto rounded-3xl border border-[var(--border-strong)] bg-[var(--surface-strong)] p-4 shadow-[var(--shadow-soft)]",
            )}
            key={item.id}
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
              {item.description}
            </p>
          </section>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}

interface ToastDemoButtonProps {
  description: string;
  title: string;
}

export function ToastDemoButton({
  description,
  title,
}: ToastDemoButtonProps) {
  const { pushToast } = useToast();

  return (
    <Button
      onClick={() => pushToast({ description, title })}
      variant="secondary"
    >
      Trigger Toast
    </Button>
  );
}
