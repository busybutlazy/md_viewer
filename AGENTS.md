# Markdown Reader Pro

一個多模式的 Markdown 閱讀器。使用者載入 `.md` 檔案後，依 frontmatter 切換三種模式：

1. **閱讀模式（Reading）** — 清晰易讀的文章樣式
2. **考試模式（Exam）** — 互動選擇題，作答後跳轉結果頁（分數、對答案、錯題置頂、所有詳解）
3. **簡報模式（Slides）** — 一頁一頁的投影片，支援鍵盤切頁、全螢幕、匯出 PDF

此專案分三個主階段漸進發展：**網頁上傳版 → 網頁授權資料夾版 → 桌面應用程式版**。

---

## 目前開發階段

> **⚠️ 每次對話開始時，Codex 必須先確認當前階段**。可透過 `docs/progress.md` 查閱，或直接問使用者。
>
> **當前階段**：`P1.3`（待開始）

階段標記規則：`P<主階段>.<子階段>`。例：`P1.4` = 階段 1 的子階段 4（閱讀模式）。

---

## 技術棧

- **框架**：Next.js 15（App Router）+ React 19 + TypeScript 5（strict）
- **樣式**：Tailwind CSS v4 + shadcn/ui
- **Markdown 渲染**：`react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-highlight`
- **Frontmatter**：`gray-matter`
- **狀態管理**：Zustand（`persist` middleware，階段 1 用 sessionStorage）
- **檔案上傳**：`react-dropzone`
- **編輯器**（階段 1.5 起）：CodeMirror 6
- **檔案系統**（階段 2 起）：File System Access API + IndexedDB 存 handle
- **桌面封裝**（階段 3 起）：Electron + electron-builder + chokidar
- **測試**：Vitest（parser 單元測試）、Playwright（e2e，視需要）
- **圖示**：`lucide-react`

**依賴原則**：穩、少、主流。能用原生就不裝套件。新增相依套件前先問 `frontend-architect`。

---

## Roadmap 總覽

完整版請看 `docs/roadmap.md`。這裡只列子階段清單與 commit message，給 Codex 快速查閱。

### 階段 1：網頁上傳檔案版

| 子階段 | 目標 | Commit message |
|---|---|---|
| P1.0 | 專案初始化（Next.js、TS、Tailwind、Vitest、目錄結構、字型） | `chore(p1.0): 初始化專案與依賴` |
| P1.1 | 設計系統基礎（tokens、dark mode、基本 UI 元件、AppShell） | `feat(p1.1): 建立設計系統與共用 UI 元件` |
| P1.2 | Markdown parser 完整實作 + 所有測試 | `feat(p1.2): 實作 markdown parser 與完整測試` |
| P1.3 | 檔案上傳、document store、parse 流程 | `feat(p1.3): 建立檔案上傳流程與 document store` |
| P1.4 | 閱讀模式（`/read`、MarkdownView、CodeBlock、TOC） | `feat(p1.4): 實作閱讀模式與 typography` |
| P1.5 | 考試模式 — 作答流程 | `feat(p1.5): 實作考試模式作答流程` |
| P1.6 | 考試模式 — 結果頁（錯題置頂、詳解） | `feat(p1.6): 實作考試結果頁與錯題詳解` |
| P1.7 | 簡報模式（切頁、鍵盤、主題、PDF 匯出） | `feat(p1.7): 實作簡報模式與基本匯出` |
| P1.8 | 首頁 polish + 三個高品質範例檔 | `feat(p1.8): 完成首頁與範例檔` |
| P1.9 | 階段 1 驗收與修整 | `chore(p1.9): 階段 1 驗收與文件更新` |

### 階段 1.5：下載式編輯

| 子階段 | 目標 | Commit message |
|---|---|---|
| P1.5.1 | 整合 CodeMirror + 即時預覽 | `feat(p1.5.1): 整合 CodeMirror 編輯器與即時預覽` |
| P1.5.2 | 下載 `.md` 機制 + 未存檔警告 | `feat(p1.5.2): 新增 markdown 下載功能` |
| P1.5.3 | 新建檔案（三種模版骨架） | `feat(p1.5.3): 支援從範本新建 markdown` |

### 階段 2：網頁授權資料夾版

| 子階段 | 目標 | Commit message |
|---|---|---|
| P2.0 | 建立 `FileSystemAdapter` 抽象層（純重構） | `refactor(p2.0): 建立檔案系統抽象層` |
| P2.1 | File System Access API + IndexedDB 授權記憶 | `feat(p2.1): 整合 File System Access API 與授權持久化` |
| P2.2 | 資料夾樹側邊欄 | `feat(p2.2): 實作資料夾樹側邊欄與檔案瀏覽` |
| P2.3 | 授權管理 UI（切換/清除、Safari/Firefox fallback） | `feat(p2.3): 實作授權管理 UI 與瀏覽器 fallback` |
| P2.4 | 寫回原檔（`Cmd/Ctrl+S`、未存檔指示） | `feat(p2.4): 實作編輯後寫回原檔` |
| P2.5 | 重新整理、新建、刪除檔案 | `feat(p2.5): 支援資料夾重新整理、新建、刪除` |
| P2.6 | 自用一週驗收 | `chore(p2.6): 階段 2 驗收與心得記錄` |

### 階段 3：桌面應用程式（Electron）

| 子階段 | 目標 | Commit message |
|---|---|---|
| P3.0 | Electron 專案結構、electron-builder、靜態匯出 | `chore(p3.0): 建立 Electron 專案結構` |
| P3.1 | 主視窗、選單列、macOS 特殊行為 | `feat(p3.1): 實作主視窗與系統選單` |
| P3.2 | `NodeFSAdapter` + 環境偵測 | `feat(p3.2): 實作 Electron 原生檔案系統 adapter` |
| P3.3 | chokidar file watcher | `feat(p3.3): 整合 chokidar 檔案監看` |
| P3.4 | 最近開啟資料夾清單 | `feat(p3.4): 實作最近開啟資料夾清單` |
| P3.5 | 打包、安裝、自用驗收 | `chore(p3.5): 打包桌面應用程式並完成自用驗證` |
| P3.6 | （可選）全域快捷鍵、tray、關聯檔案 | `feat(p3.6.x): <逐項>` |

---

## 目錄結構

```
markdown-reader-pro/
├── AGENTS.md                    # 本檔案，每次對話開始時讀入
├── docs/
│   ├── roadmap.md               # 完整 roadmap，含每個子階段的驗收標準
│   ├── progress.md              # 當前進度與日誌
│   ├── decisions.md             # 架構決策紀錄（ADR-lite）
│   ├── template-spec.md         # 三種模版的完整規範
│   └── phase2-notes.md          # 階段 2 自用心得（階段 2 才會產生）
├── frontend/
│   ├── Dockerfile               # 前端容器映像
│   ├── package.json
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # 首頁：上傳 / 選資料夾 / 範例
│   │   │   ├── read/page.tsx
│   │   │   ├── exam/
│   │   │   │   ├── page.tsx
│   │   │   │   └── result/page.tsx
│   │   │   ├── slides/page.tsx
│   │   │   └── edit/page.tsx    # P1.5 起
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui 客製
│   │   │   ├── markdown/        # MarkdownView、CodeBlock、Heading、TOC
│   │   │   ├── exam/            # QuestionCard、OptionItem、ResultSummary
│   │   │   ├── slides/          # SlideFrame、SlideNavigator、SpeakerNotes
│   │   │   ├── editor/          # P1.5 起：CodeMirror wrapper
│   │   │   └── folder/          # P2 起：FolderTree、FileSearch
│   │   ├── lib/
│   │   │   ├── parsers/         # 共用解析邏輯
│   │   │   ├── fs/              # P2 起：FileSystemAdapter 與實作
│   │   │   ├── store/           # Zustand stores
│   │   │   └── utils.ts
│   │   └── styles/
│   │       ├── prose.css
│   │       └── slides.css
│   ├── public/
│   └── samples/                 # 三個模式的範例 .md
├── backend/                     # 後端服務預留位置
├── .agents/
│   └── skills/                  # repo-local skills
├── electron/                    # P3 起，桌面層整合
│   ├── main/
│   ├── preload/
│   └── shared/
└── docker-compose.yml           # repo 級開發編排
```

---

## Markdown 模版規格（Template Spec）⚠️ 關鍵

> 詳細規格與邊界條件請看 `docs/template-spec.md`。以下是摘要。

以 frontmatter 的 `type` 欄位決定模式。**沒有 `type` 時預設為閱讀模式**。

### 1. 閱讀模式

```markdown
---
title: 文章標題          # 可選
author: 作者名           # 可選
date: 2026-04-18         # 可選
tags: [react, ui]        # 可選
---

# 標準 markdown 內容（GFM、fenced code、表格、圖片）
```

### 2. 考試模式

- 每題以 `## Q{n}:` 或 `## Q{n}：` 開頭（支援全形冒號）
- 選項 `- [ ]` / `- [x]`。有 ≥2 個 `[x]` 視為複選題
- 詳解用 `> 解析:` blockquote

```markdown
---
type: quiz
title: JavaScript 基礎測驗
shuffle: true
shuffleOptions: true
passingScore: 60
timeLimit: 600
---

## Q1: 以下哪個不是 JavaScript 的原始型別？

- [ ] string
- [ ] number
- [x] array
- [ ] boolean

> 解析: array 是 object 的一種，不是原始型別。
```

### 3. 簡報模式

- 以單獨一行的 `---`（三個以上連字號）切頁
- **程式碼區塊內的 `---` 不算**（parser 必須處理）
- 講者備忘：`<!-- speaker: ... -->`

```markdown
---
type: slides
title: 我的簡報
theme: default
aspectRatio: "16:9"
---

# 封面

---

## 第二頁
<!-- speaker: 講者備忘 -->
```

---

## 開發規範

### TypeScript
- 全面 TS，禁用 `any`（改用 `unknown` + type guard）
- Props 用 `interface`，union/intersection 才用 `type`
- 匯出型別與 component 同檔同名

### React
- Function declaration，不用 arrow function 賦值
- 優先 Server Components，需互動性才 `'use client'`
- 檔案命名：元件 PascalCase，工具 kebab-case

### 路徑
- 前端實作檔案統一放在 `frontend/`
- 後端加入後應放在 `backend/`，不要再把前端程式碼散落回 repo root

### 樣式
- Tailwind utility classes 為主
- Dark mode 從第一天做，`dark:` prefix
- 間距用 Tailwind spacing scale，避免任意值

### 狀態管理
- 階段 1：Zustand + sessionStorage
- 階段 2+：可升級為 IndexedDB 持久化
- 跨路由切換狀態不得遺失（除非明確清除）

### 無障礙
- 互動元素鍵盤可達
- 選項用 `<label>` 包 `<input>`
- 結果頁錯題區塊 `aria-live="polite"`
- 簡報模式支援鍵盤：`←` `→` 切頁、`F` 全螢幕、`ESC` 結束、`S` 講者模式、`O` 總覽

### 字型
- 中文：Noto Sans TC；英文：Inter；程式碼：JetBrains Mono
- `next/font` 引入

---

## Git Workflow ⚠️ 重要

**每個子階段完成時必須 commit**。由 `git-workflow-specialist` skill 把關。

### 分支層級說明

本專案採用兩層分支結構：

```
main
 └── dev_jett/phase1          ← 從 main 切出；整個 phase 完成後 PR → main（人工審核）
       ├── dev_jett/p1.1      ← 從 phase1 切出；完成後 PR → phase1（自動，通過驗收清單即可）
       ├── dev_jett/p1.2      ← 從 phase1 切出（p1.1 merge 後才切）
       └── ...
 └── dev_jett/phase2          ← phase1 合入 main 後才切出
```

- **phase branch**（如 `dev_jett/phase1`）：從 `main` 切出，phase 全部完成後發 PR 到 `main` 等人工審核
- **subtask branch**（如 `dev_jett/p1.2-parser`）：從 phase branch 切出，完成後 PR merge 回 phase branch，**不需等人工審核**，通過 lint / test / build 即可

### 規則

1. **`main` 是正式整合分支**：phase branch 從 `main` 切出，phase 完成後 PR 回 `main`
2. **所有開發與 commit 僅能發生在 `dev_jett/*` 分支**：subtask 用 `dev_jett/p1.2-parser` 格式，phase 用 `dev_jett/phase1` 格式
3. **禁止建立裸 `dev_jett` 分支**：`dev_jett` 只作為 branch namespace，合法名稱必須是 `dev_jett/<task-name>`
4. **`main` 禁止直接 commit**：subtask 完成 → PR → phase branch；phase 完成 → PR → main
5. **Commit message 格式**：見上方 Roadmap 表格，或 `.agents/skills/git-workflow-specialist/SKILL.md`
6. **Commit 前驗收清單**（子階段結束時）：
   - 在容器內執行 `pnpm lint` 通過（零 warning）
   - 在容器內執行 `pnpm test` 通過（parser 相關子階段必驗）
   - 在容器內執行 `pnpm build` 通過
   - 手動驗收該子階段目標（逐條對照 `docs/roadmap.md`）
7. **每個任務結束後都要使用 `task-plan` skill**：更新 `docs/task-plan/task-plan.json` 中對應任務狀態，並立即查詢目前進度，確認當前完成比例、目前所在階段與下一個待辦，避免資訊遺失
8. **Commit 後流程**：更新 `docs/progress.md`、更新 `AGENTS.md` 的「當前階段」行，確認 `task-plan` 已同步，再依層級發 PR（subtask → phase branch；phase → main）

### 例外

- 單純修 bug / 補測試 / 調字級：**小 commit** 即可，不用等子階段
- 跨多個子階段的大重構：先討論、寫進 `docs/decisions.md`、再執行

---

## 執行方式

```bash
# 原則：不要在本機安裝專案依賴，統一在容器內執行
# 以下為 P1.0 / 5.1 完成後的標準命令形式

docker compose up app                           # 啟動開發伺服器
docker compose run --rm app pnpm lint          # ESLint + type check
docker compose run --rm app pnpm test          # Vitest
docker compose run --rm app pnpm build         # 正式 build
docker compose run --rm app pnpm test:e2e      # Playwright（P1.9 之後才啟用）

# 階段 3 起
docker compose run --rm app pnpm electron:dev
docker compose run --rm app pnpm electron:build
```

在 Docker Compose 尚未建立前，不應要求協作者先在本機安裝專案依賴；容器化是此專案的既定方向與後續實作前提。

---

## Skills 使用指引

本專案配置 7 個 repo-local skills，供 Codex 依任務載入與遵循。

| Skill | 負責範圍 | 主要階段 |
|-------|---------|---------|
| `markdown-parser-specialist` | `frontend/src/lib/parsers/` 所有解析邏輯、parser 測試 | P1.2、持續 |
| `reading-mode-specialist` | `frontend/src/app/read/`、typography、markdown 渲染元件 | P1.4、持續 |
| `quiz-mode-specialist` | `frontend/src/app/exam/`、`frontend/src/app/exam/result/`、作答狀態、結果頁 | P1.5、P1.6 |
| `slides-mode-specialist` | `frontend/src/app/slides/`、分頁、鍵盤、主題、匯出 | P1.7、持續 |
| `ui-ux-designer` | 設計系統、視覺一致性、a11y、empty/loading/error 狀態 | P1.1、持續 |
| `frontend-architect` | 路由、狀態、相依性、效能、跨階段重構 | 全階段 |
| `git-workflow-specialist` | Commit message、branch、驗收清單、progress 日誌 | 每個子階段結尾 |

以上 skill 檔案位置：`.agents/skills/<skill-name>/SKILL.md`。

**階段 2 若需要新增** `fs-integration-specialist`，也應以相同 skill 格式放到 `.agents/skills/`。  
**階段 3 若需要新增** `desktop-integration-specialist`，也應以相同 skill 格式放到 `.agents/skills/`。

---

## 給 Codex 的重要提醒

1. **對話開始時先確認當前階段**。看 `docs/progress.md` 的最後一筆，或直接問使用者。
2. **不要跨階段施工**。使用者在 P1.4 時要求加 File System Access API，應提醒「這是 P2.1 的工作，要先完成 P1.4–P1.9 嗎？」
3. **先讀 `docs/template-spec.md` 再寫 parser**。parser 錯了，下游全部白寫。
4. **UI 變動前先用 Glob/Grep 看現有元件**，不要重新造相同東西。
5. **遇到模版格式模糊處來問使用者**，不要猜（例如：複選題要不要部分分數？）。
6. **Dark mode 不是後補**，每個 component 寫完都要兩種配色都檢查。
7. **每個子階段結束時主動呼叫 `git-workflow-specialist` 跑驗收清單**，不要自己跳過。
8. **每個任務結束後都要呼叫 `task-plan` skill**：同步任務狀態並查詢當下進度，不可只改程式不改計畫表。
9. **分支層級不可搞混**：subtask branch 從 phase branch 切出，phase branch 從 `main` 切出；不可 subtask 直接從 `main` 切，也不可 phase 從其他 subtask 切。
10. **`main` 只接受 phase branch 的 PR**，不要直接在 `main` 上開發或 commit，也不要建立裸 `dev_jett` 分支。
11. **`AGENTS.md` 的「當前階段」行**每個子階段結束後要更新。
