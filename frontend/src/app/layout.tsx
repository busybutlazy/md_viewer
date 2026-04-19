import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_TC } from "next/font/google";
import { AppShell } from "@/components/ui/AppShell";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansTc = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Markdown Reader Pro",
  description: "多模式 Markdown 閱讀器設計系統基礎",
};

const themeScript = `
(() => {
  const storedTheme = window.localStorage.getItem("mrp-theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const nextTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : systemTheme;
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${notoSansTc.variable} ${jetBrainsMono.variable} min-h-screen font-sans text-[var(--foreground)] antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
