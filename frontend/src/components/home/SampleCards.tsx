"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import { getRouteByDocumentMode } from "@/lib/document-routes";
import { createUploadAdapterFromMarkdown } from "@/lib/fs/upload-adapter";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

export function SampleCards() {
  const t = useT();
  const router = useRouter();
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const hasDocument = useDocumentStore((state) => Boolean(state.markdown));

  async function handleOpenSample(fileName: string) {
    const response = await fetch(`/samples/${fileName}`);
    const markdown = await response.text();
    const adapter = createUploadAdapterFromMarkdown(fileName, markdown);
    clearExamSession();
    const nextMode = await loadDocumentFromAdapter(adapter);
    router.push(getRouteByDocumentMode(nextMode));
  }

  const modes = [
    {
      id: "read",
      num: "01",
      pill: t.nav.read,
      title: "深度閱讀模式",
      desc: "沈浸式排版，目錄導航，閱讀進度追蹤，讓長篇文章讀起來像書。",
      sample: "reading-sample.md",
      preview: <ReadPreview />,
      previewBg: "linear-gradient(180deg, #faf5e8 0%, #f2ece0 100%)",
    },
    {
      id: "exam",
      num: "02",
      pill: t.nav.exam,
      title: "考試測驗模式",
      desc: "單/多選、計時、自動批改、錯題詳解，一份 markdown 就是一份考卷。",
      sample: "exam-sample.md",
      preview: <ExamPreview />,
      previewBg: "linear-gradient(180deg, #f5efe1 0%, #ede5d3 100%)",
    },
    {
      id: "slides",
      num: "03",
      pill: t.nav.slides,
      title: "簡報演示模式",
      desc: "用 `---` 切換投影片，講者備忘、概覽模式、全螢幕一鍵切換。",
      sample: "slides-sample.md",
      preview: <SlidesPreview />,
      previewBg: "linear-gradient(180deg, #1a1712 0%, #2a241c 100%)",
    },
    {
      id: "edit",
      num: "04",
      pill: t.nav.edit,
      title: "即時編輯模式",
      desc: "左欄編輯右欄預覽，語法高亮，支援儲存回資料夾或下載副本。",
      sample: "reading-sample.md",
      preview: <EditPreview />,
      previewBg: "#faf5e8",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Section header */}
      <div className="flex items-end justify-between gap-8">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            {t.home.samples.label}
          </p>
          <h2
            className="font-serif font-medium leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: "36px" }}
          >
            {t.home.samples.heading}
          </h2>
        </div>
        <p className="max-w-[360px] text-[13px] leading-[1.6] text-[var(--muted-foreground)]">
          上傳 markdown，frontmatter 自動決定模式。也可直接開啟下方範例。
        </p>
      </div>

      {/* Mode cards 2×2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className="group relative flex cursor-pointer flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)] text-left transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-soft)]"
            style={{
              borderRadius: "var(--radius-xl)",
              minHeight: "380px",
            }}
            onClick={() => void handleOpenSample(mode.sample)}
            type="button"
          >
            {/* Preview area */}
            <div
              className="relative overflow-hidden border-b border-[var(--border)]"
              style={{ height: "200px", background: mode.previewBg }}
            >
              {mode.preview}
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col gap-2.5 p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[var(--muted-foreground)]">
                  {mode.num}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] text-[var(--accent-strong)]"
                  style={{ borderRadius: "999px" }}
                >
                  {mode.pill}
                </span>
              </div>

              <h3
                className="font-serif font-medium leading-[1.1] tracking-[-0.01em]"
                style={{ fontSize: "28px" }}
              >
                {mode.title}
              </h3>
              <p className="max-w-[38ch] text-[13.5px] leading-[1.65] text-[var(--ink-soft)]">
                {mode.desc}
              </p>

              <div className="mt-auto flex items-center justify-between pt-3.5 text-[12px] text-[var(--muted-foreground)]">
                <span>{hasDocument ? t.sampleCards.tryItLoaded : t.sampleCards.tryIt}</span>
                <span
                  className="inline-grid h-8 w-8 place-items-center bg-[var(--background)] text-[var(--foreground)] transition-all duration-200 group-hover:translate-x-1 group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)]"
                  style={{ borderRadius: "999px" }}
                >
                  <ArrowRight />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Templates strip */}
      <div className="border-t border-[var(--border)] pt-10">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
          {t.sampleCards.template}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {t.sampleCards.items.map((sample) => (
            <div
              key={sample.fileName}
              className="flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent-strong)]"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[var(--background)] text-[var(--muted-foreground)]"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                <DocIcon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{sample.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                  {sample.badge}
                </p>
              </div>
              <a
                className="flex-shrink-0 text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                download={sample.fileName}
                href={`/samples/${sample.fileName}`}
                onClick={(e) => e.stopPropagation()}
              >
                <DownloadIcon />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Inline preview components ---- */

function ReadPreview() {
  return (
    <div className="flex h-full flex-col px-7 pt-7 font-serif">
      <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
        reading · 2024
      </p>
      <h5
        className="mb-3 font-serif font-medium leading-tight tracking-[-0.01em] text-[var(--foreground)]"
        style={{ fontSize: "22px" }}
      >
        深度閱讀指南
      </h5>
      <p className="text-[13px] leading-[1.7] text-[var(--ink-soft)]" style={{ columnCount: 2, columnGap: "22px" }}>
        以連貫方式閱讀長篇 markdown 文件，目錄自動生成，閱讀進度清晰可見，讓知識留在腦海中。
      </p>
      {/* TOC dots */}
      <div className="absolute right-6 top-7 flex flex-col gap-1.5">
        {[true, false, false, false].map((active, i) => (
          <span
            key={i}
            className="block h-0.5"
            style={{
              width: active ? "30px" : "22px",
              background: active ? "var(--accent)" : "var(--border-strong)",
              borderRadius: "2px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ExamPreview() {
  return (
    <div className="flex h-full flex-col gap-3 px-6 pt-6">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Q <span className="font-bold text-[var(--accent-strong)]">01</span> / 25
        </span>
      </div>
      <p className="text-[14px] font-semibold leading-[1.5] text-[var(--foreground)]">
        以下哪個是 JavaScript 的原始型別？
      </p>
      {["A. Object", "B. String", "C. Array"].map((opt, i) => (
        <div
          key={opt}
          className="flex items-center gap-2.5 border text-[12.5px]"
          style={{
            padding: "9px 12px",
            borderRadius: "12px",
            background: i === 1 ? "var(--accent-soft)" : "rgba(255,255,255,0.6)",
            borderColor: i === 1 ? "var(--accent)" : "var(--border)",
          }}
        >
          <span
            className="inline-grid h-[18px] w-[18px] place-items-center font-mono text-[10px]"
            style={{
              borderRadius: "999px",
              border: i === 1 ? "1.5px solid var(--accent)" : "1.5px solid var(--border-strong)",
              background: i === 1 ? "var(--accent)" : "transparent",
              color: i === 1 ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {String.fromCharCode(65 + i)}
          </span>
          {opt.slice(3)}
        </div>
      ))}
      {/* Timer */}
      <div
        className="absolute right-6 top-6 font-mono text-[12px] font-semibold text-[var(--accent-strong)]"
        style={{
          background: "rgba(255,255,255,0.7)",
          padding: "4px 10px",
          borderRadius: "999px",
          border: "1px solid var(--border)",
        }}
      >
        12:34
      </div>
    </div>
  );
}

function SlidesPreview() {
  return (
    <div className="flex h-full flex-col gap-3 px-6 pt-6">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[rgba(242,236,224,0.55)]">
        <span>slide mode</span>
        <span>1 / 8</span>
      </div>
      <div
        className="flex flex-1 flex-col justify-center"
        style={{
          padding: "18px",
          borderRadius: "14px",
          background: "rgba(242,236,224,0.06)",
          border: "1px solid rgba(242,236,224,0.1)",
        }}
      >
        <h6
          className="mb-1.5 font-serif font-medium leading-[1.15] tracking-[-0.01em]"
          style={{ fontSize: "22px", color: "#f2ece0" }}
        >
          產品發布
          <em className="italic" style={{ color: "var(--accent)" }}> 2025</em>
        </h6>
        <p className="text-[11px] leading-[1.5]" style={{ color: "rgba(242,236,224,0.6)" }}>
          新功能、路線圖與里程碑
        </p>
      </div>
      <div className="flex gap-1.5">
        {[true, false, false, false, false].map((active, i) => (
          <span
            key={i}
            className="flex-1 h-1"
            style={{
              borderRadius: "2px",
              background: active ? "var(--accent)" : "rgba(242,236,224,0.14)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EditPreview() {
  return (
    <div
      className="grid h-full font-mono text-[11px] leading-[1.7]"
      style={{ gridTemplateColumns: "1fr 1fr" }}
    >
      {/* Code pane */}
      <div className="overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--ink-soft)]">
        <p><span className="font-semibold text-[var(--muted-foreground)]">---</span></p>
        <p><span className="text-[var(--accent-strong)] font-semibold">title</span>: 我的文件</p>
        <p><span className="text-[var(--accent-strong)] font-semibold">mode</span>: reading</p>
        <p><span className="font-semibold text-[var(--muted-foreground)]">---</span></p>
        <p className="mt-1 font-bold text-[var(--foreground)]"># 章節標題</p>
        <p className="text-[var(--ink-soft)]">這是<span className="italic text-[var(--accent-strong)]">斜體</span>文字</p>
        <span
          className="inline-block w-[1.5px] bg-[var(--accent)]"
          style={{ height: "11px", verticalAlign: "-1px", animation: "blink 1.1s steps(2) infinite" }}
        />
      </div>
      {/* Preview pane */}
      <div className="overflow-hidden bg-[var(--background)] p-4 font-serif">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">preview</p>
        <h1 className="mb-1.5 font-serif font-semibold leading-tight" style={{ fontSize: "16px" }}>章節標題</h1>
        <p className="text-[13px] leading-[1.6] text-[var(--ink-soft)]">
          這是<em className="italic">斜體</em>文字
        </p>
      </div>
    </div>
  );
}

/* ---- Icons ---- */

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
    </svg>
  );
}
