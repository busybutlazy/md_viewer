import { Suspense } from "react";
import { HomeShowcase } from "@/components/home/HomeShowcase";
import { UploadPanel } from "@/components/home/UploadPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-4">
            <Badge className="w-fit" tone="accent">
              P1.1 Design System
            </Badge>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                Reading-first interface foundation
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Markdown Reader Pro
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                設計系統現在有一致的 shell、可持久化的亮暗主題、以及可重用
                的 UI primitives。接下來的 Reading、Exam、Slides 都會沿用這套
                視覺與互動基底。
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Try Upload Flow</Button>
            <Button variant="secondary">Explore Samples</Button>
            <Button variant="ghost">Read ADR</Button>
          </CardContent>
        </Card>

        <Card className="justify-between">
          <CardHeader>
            <Badge className="w-fit" tone="outline">
              System Preview
            </Badge>
            <CardTitle>Three modes, one product language</CardTitle>
            <CardDescription>
              Slate-based surfaces keep the product calm. Accent color is reserved
              for direction, status, and primary actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl bg-[var(--accent-soft)] p-4">
              <p className="text-sm font-semibold">Reading</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Prose-first spacing, quiet chrome, stable typography.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">Exam</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Clear focus states and progress feedback without noisy visuals.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold">Slides</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Strong framing and keyboard-friendly controls, ready for fullscreen.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="mt-6">
        <Suspense fallback={null}>
          <UploadPanel />
        </Suspense>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Badge className="w-fit" tone="accent">
              Noto Sans TC
            </Badge>
            <CardDescription>
              繁體中文閱讀體驗需要穩定的筆畫與行距，這組字型負責長文與主要內容。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-lg leading-8">
            這裡是閱讀模式的主要排版基底，優先追求舒適與可持續閱讀。
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Badge className="w-fit" tone="outline">
              Inter
            </Badge>
            <CardDescription>
              Metadata, labels, and dense control surfaces stay crisp at small sizes.
            </CardDescription>
          </CardHeader>
          <CardContent className="font-[var(--font-inter)] text-lg leading-8">
            Interface copy should feel compact, precise, and easy to scan.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Badge className="w-fit">JetBrains Mono</Badge>
            <CardDescription>
              Command, code block, and diagnostic language stays visually distinct.
            </CardDescription>
          </CardHeader>
          <CardContent className="font-mono text-sm leading-7">
            {`docker compose run --rm app pnpm lint`}
          </CardContent>
        </Card>
      </section>

      <div className="mt-6">
        <HomeShowcase />
      </div>
    </main>
  );
}
