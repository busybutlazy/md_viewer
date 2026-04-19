# Markdown Reader Pro

多模式 Markdown 閱讀器。載入 `.md` 後，依 frontmatter 自動切換到三種模式：

- Reading：文章閱讀模式
- Exam：互動選擇題模式
- Slides：投影片模式

目前已完成階段 1：網頁上傳版。下一步是 `P1.5.1` 下載式編輯。

## Quick Start

此專案採 Docker-first 開發流程，不需要在本機安裝 Node 或 pnpm。

```bash
docker compose up app
```

啟動後開啟 `http://localhost:3000`。

常用驗收指令：

```bash
docker compose run --rm app pnpm lint
docker compose run --rm app pnpm test
docker compose run --rm app pnpm build
```

## Phase 1 Features

- 首頁支援拖放或選取 `.md`、`.markdown`、`.txt`
- 上傳後自動解析 frontmatter 並導向 Reading、Exam 或 Slides
- Zustand + `sessionStorage` 持久化，重整後仍保留目前文件與答題狀態
- Reading mode 含 typography、code highlight、TOC、reading progress
- Exam mode 含單選/複選、作答持久化、倒數計時、自動提交、結果頁與詳解
- Slides mode 含鍵盤切頁、overview、speaker notes、fullscreen、`window.print()` PDF 匯出
- 首頁內建 sample cards，可直接載入三種模式範例

## Supported Markdown Formats

模式由 frontmatter `type` 決定；未提供 `type` 時預設為 Reading。

### Reading

```md
---
title: 文件標題
author: 作者
date: 2026-04-19
tags: [react, ui]
---
```

支援一般 GFM 內容，包括：

- headings
- fenced code block
- table
- task list
- blockquote
- image

### Exam

```md
---
type: quiz
title: JavaScript 基礎測驗
shuffle: true
shuffleOptions: true
passingScore: 60
timeLimit: 600
---

## Q1: 題目

- [ ] 選項 A
- [x] 選項 B

> 解析: 詳解文字
```

規則：

- 題目以 `## Q{n}:` 或 `## Q{n}：` 開頭
- 選項使用 `- [ ]` / `- [x]`
- 兩個以上正解會被視為複選題
- 詳解使用 `> 解析:`

### Slides

```md
---
type: slides
title: 我的簡報
theme: default
aspectRatio: "16:9"
---

# 第一頁

---

## 第二頁
<!-- speaker: 講者備忘 -->
```

規則：

- 單獨一行的 `---` 會切頁
- code block 內的 `---` 不會切頁
- `<!-- speaker: ... -->` 會解析成 speaker notes
- `theme` 支援 `default`、`dark`、`minimal`
- `aspectRatio` 支援 `16:9`、`4:3`

完整規格請看 [docs/template-spec.md](docs/template-spec.md)。

## Samples

repo 內建範例檔位於 [frontend/samples](frontend/samples)：

- `reading-sample.md`
- `exam-sample.md`
- `slides-sample.md`
- `reading-deep-dive.md`
- `acceptance/`：phase 1 smoke test 使用的驗收樣本

## Known Limitations

- 階段 1 僅支援上傳單一檔案，不支援直接授權資料夾
- 文件與考試狀態只保存在 `sessionStorage`，關閉分頁或新視窗後不會跨裝置同步
- Slides 的 PDF 匯出目前依賴瀏覽器 `window.print()`，不是獨立排版引擎
- Exam 計分採完全匹配，複選題沒有部分給分
- 尚未啟用 e2e 測試；目前驗收以 lint、Vitest、build 與 markdown acceptance corpus 為主

## Repo Layout

- `frontend/`：Next.js 前端應用、samples、parser/store/components
- `backend/`：後端保留位置
- `docs/`：roadmap、progress、decisions、template spec、task plan
- `.agents/skills/`：repo-local workflow skills

## Development Notes

- 前端實作檔案統一放在 `frontend/`
- 請遵守 [AGENTS.md](AGENTS.md) 的 phase、branch、commit 規則
- 子階段結束前需通過 `lint`、`test`、`build`

## Related Docs

- [AGENTS.md](AGENTS.md)
- [docs/roadmap.md](docs/roadmap.md)
- [docs/progress.md](docs/progress.md)
- [docs/template-spec.md](docs/template-spec.md)
- [docs/task-plan/task-plan.json](docs/task-plan/task-plan.json)
