import { Suspense } from "react";
import { HomeShowcase } from "@/components/home/HomeShowcase";
import { SampleCards } from "@/components/home/SampleCards";
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
        <Card className="overflow-hidden border-[var(--border-strong)] bg-[var(--surface-strong)]">
          <CardHeader className="space-y-6">
            <Badge className="w-fit" tone="accent">
              Phase 1 Web App
            </Badge>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                Read · Quiz · Present
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Markdown Reader Pro
              </h1>
              <p className="max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                一份 markdown，上傳後就能依 frontmatter 自動切換成閱讀、考試或簡報模式。
                這個首頁現在直接串上 sample 與 upload flow，不再只是設計系統展示頁。
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold">Reading</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                適合長文、表格、圖片與 code block 的安定排版。
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold">Exam</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                支援單選、複選、作答持久化、倒數計時與結果詳解。
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold">Slides</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                鍵盤切頁、speaker notes、overview 與 print 匯出。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-strong),var(--surface))]">
          <CardHeader className="space-y-4">
            <Badge className="w-fit" tone="outline">
              Launch Fast
            </Badge>
            <CardTitle>從 upload 或 sample 直接進入模式</CardTitle>
            <CardDescription>
              Phase 1 先聚焦在單檔體驗，之後 phase 2 才會接資料夾授權與檔案樹。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-center">Upload Markdown</Button>
            <Button className="w-full justify-center" variant="secondary">
              Open Sample Deck
            </Button>
            <Button className="w-full justify-center" variant="ghost">
              Read Project Notes
            </Button>
          </CardContent>
        </Card>
      </section>

      <div className="mt-8">
        <Suspense fallback={null}>
          <UploadPanel />
        </Suspense>
      </div>

      <section className="mt-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
              Sample Files
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              三種模式各有一份可直接驗收的正式範例
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
            點開後會直接寫進 document store，再導到對應 route。
          </p>
        </div>
        <SampleCards />
      </section>

      <div className="mt-8">
        <HomeShowcase />
      </div>

      <footer className="mt-10 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted-foreground)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Markdown Reader Pro · Phase 1 upload-first workflow</p>
          <p className="font-mono">docker compose run --rm app pnpm build</p>
        </div>
      </footer>
    </main>
  );
}
