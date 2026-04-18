function FontSample({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[28px] border border-border bg-surface p-5 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        {label}
      </p>
      <div className={`mt-3 ${className}`}>{children}</div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12 sm:px-10 lg:px-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            P1.0 Project Bootstrap
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent">
              Docker First · Next.js 15 · Vitest
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Markdown Reader Pro
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              一個以文件為核心的 Markdown 閱讀器，會依 frontmatter 在閱讀、
              考試與簡報模式之間切換。這個首頁用來驗證 P1.0 的字型、
              Tailwind、App Router 與容器化開發環境已接好。
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-surface-strong p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
            Stack
          </p>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-muted">
            <li>Next.js 15 App Router</li>
            <li>React 19 + TypeScript strict</li>
            <li>Tailwind CSS v4</li>
            <li>Vitest + Testing Library</li>
            <li>Docker Compose development flow</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <FontSample
          label="Noto Sans TC"
          className="font-sans text-lg leading-8 text-foreground"
        >
          繁體中文閱讀體驗需要穩定的筆畫與行距，這裡用來驗證首頁主字型。
        </FontSample>
        <FontSample
          label="Inter"
          className="font-[var(--font-inter)] text-lg leading-8 text-foreground"
        >
          Inter keeps metadata, labels, and dense UI text crisp and legible.
        </FontSample>
        <FontSample
          label="JetBrains Mono"
          className="font-mono text-sm leading-7 text-foreground"
        >
          {`pnpm lint && pnpm test && pnpm build`}
        </FontSample>
      </section>
    </main>
  );
}
