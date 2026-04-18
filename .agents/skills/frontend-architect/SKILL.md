---
name: "frontend-architect"
description: "Use this skill for cross-cutting frontend decisions such as routing, layout, global state, dependency choices, build and dev config, or changes spanning multiple modes."
---
# Frontend Architect

負責 Markdown Reader Pro 的整體前端架構，關注跨模式、跨階段、跨資料流的決策。

## When to Use

- 需要新增或調整路由、layout、metadata
- 需要修改 Zustand store 結構或跨頁狀態流
- 任務橫跨多個模式或多個資料夾
- 需要評估相依套件、build/dev config、檔案結構
- 正在進行階段轉換，例如 P1 到 P1.5、P1.5 到 P2、P2 到 P3

## Responsibilities

- Next.js 路由與 layout 結構
- Zustand store 架構與資料流
- 輸入、解析、儲存、模式頁消費之間的邊界
- 跨模式抽象，例如 P2 的 FileSystemAdapter
- `tsconfig.json`、`next.config.ts`、`tailwind.config.ts`、`package.json`
- bundle size、code splitting、開發體驗
- 重要架構選擇的 ADR，記錄於 `docs/decisions.md`

## Architectural Principles

### 1. One Source of Truth

上傳或載入後的原始 markdown 應只存在一份文件 store。各模式從同一份資料衍生，不做重複狀態。

### 2. Parse Once

載入時完成 frontmatter、mode detection 與 mode-specific parse。模式頁只消費 parse 完的資料，不在 mount 時重跑 parser。

### 3. Feature Isolation

各模式維持在各自的 route 與 component 範圍內。共享邏輯放在 `src/components/`、`src/lib/`，避免 mode 彼此直接耦合。

### 4. Adapter Pattern for I/O

P2 之後所有檔案讀寫都走 `FileSystemAdapter`。模式頁不直接碰 File System API 或 Node API。

### 5. Boring Technology

- Next.js App Router
- Zustand
- Tailwind
- react-markdown
- Vitest

優先選穩定、少依賴、容易維護的方案。

## Store Guidance

- 文件 store 保管 raw markdown、frontmatter、mode、parsed payload、warnings、dirty state
- quiz session 與 folder tree 可拆成獨立 store
- P1 與 P1.5 優先用 `persist + sessionStorage`
- P2 之後才考慮 IndexedDB

## Routing Guidance

預設路由：

- `/`
- `/read`
- `/exam`
- `/exam/result`
- `/slides`
- `/edit`

若使用者直接進入模式頁但 store 為空，應導回首頁並給出明確提示。

## Dependency Checklist

新增套件前先問：

1. 能不能用現有依賴或瀏覽器原生 API 解決
2. 是否與 React 19 / Next 15 相容
3. 維護是否活躍
4. 型別是否完整
5. 是否有更輕量替代方案

重要選型要寫進 `docs/decisions.md`。

## Phase Awareness

特別重要的節點：

- P1.0：專案骨架與核心技術
- P1.3：document store 設計
- P1.5.1：edit route 與整合方式
- P2.0：FileSystemAdapter 介面
- P3.0：Electron 與 Next.js 整合方式
- P3.2：IPC 邊界與安全模型

## Coordination

- parser 工作交給 `markdown-parser-specialist`
- 純 UI 與視覺一致性交給 `ui-ux-designer`
- commit 與階段驗收交給 `git-workflow-specialist`

## Red Flags

- 想引入 auth、server DB、帳號系統：先確認是否超出目前 client-only 範圍
- 中途要求跨階段大重構：先寫 ADR 再動手
- 為了小需求引入重型框架：先提出更簡單方案
