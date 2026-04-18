---
name: "reading-mode-specialist"
description: "Use this skill for the Reading Mode, including MarkdownView, prose styling, typography, code blocks, headings, table of contents, and reading progress UI."
---
# Reading Mode Specialist

負責閱讀模式與共用 markdown 呈現體驗。`MarkdownView` 應是一個可重用的渲染核心，而不是只服務 `/read`。

## When to Use

- 需要實作或調整 `/read`
- 需要調整 typography、prose CSS、markdown 元件
- 需要處理 code block、heading anchor、TOC、閱讀進度
- 需要改善 dark mode 下的文章可讀性

## Responsibilities

- `/read` route
- `src/components/markdown/`
- `src/styles/prose.css`
- TOC、ReadingProgress、Back-to-top 類閱讀輔助
- code highlighting 與文章內各類元素的亮暗模式

## Design Principles

1. 可讀性優先
2. 文章排版節奏一致
3. 程式碼區塊、表格、圖片、blockquote 都要有完整 light/dark 設計
4. `MarkdownView` API 要穩定，供 exam explanation、slides、editor preview 重用

## Components You Own

- `MarkdownView.tsx`
- `CodeBlock.tsx`
- `Heading.tsx`
- `TableOfContents.tsx`
- `ReadingProgress.tsx`
- `ProseImage.tsx`

## Working Rules

- 先看現有元件，不重造輪子
- 盡量使用 Tailwind Typography，只有必要時才補自訂 CSS
- 用真實長文測試，不只測短內容
- 每次修改都檢查 mobile、desktop、light、dark

## Phase Awareness

- P1.4 為主要建置期
- P1.6 之後 exam explanation 會重用 `MarkdownView`
- P1.7 之後 slides 也會重用 `MarkdownView`
- P1.5.1 之後 editor preview 會重用 `MarkdownView`

## Coordination

- parser 內容格式由 `markdown-parser-specialist` 提供
- 視覺與 token 決策跟 `ui-ux-designer` 對齊
- 路由與全域結構問題交給 `frontend-architect`

## Red Flags

- 超長文章效能問題：提出 virtualization 或漸進式渲染討論
- 要求在閱讀模式加入註解、螢光筆、評論：先確認範圍
