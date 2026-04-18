# Markdown Reader Pro

多模式 Markdown 閱讀器。使用者載入 `.md` 檔案後，依 frontmatter 自動切換到不同模式：

- Reading：文章閱讀模式
- Exam：互動選擇題模式
- Slides：投影片模式

專案採分階段開發：

1. 網頁上傳版
2. 網頁授權資料夾版
3. 桌面應用程式版（Electron）

## Current Status

目前階段為 `P1.3`，已完成 `P1.2` parser 與測試。  
目前已具備：

- Docker Compose 開發環境
- Next.js 15 + TypeScript + Tailwind + Vitest 專案骨架
- AppShell、dark mode、基礎 UI 元件與設計 tokens
- frontmatter / mode detection / quiz / slides parser 與 parser 測試
- 前端應用集中於 `frontend/`，方便後續與 `backend/` 並存

## Planned Features

### Reading Mode

- 文章排版優先的閱讀體驗
- Table of Contents
- Reading progress
- 程式碼區塊高亮與 copy

### Exam Mode

- 單選與複選題作答
- 計時器、作答進度
- 結果頁、錯題置頂、詳解顯示

### Slides Mode

- 一頁一頁的投影片瀏覽
- 鍵盤切頁
- Speaker notes
- 全螢幕與 PDF 匯出

## Markdown Templates

由 frontmatter 的 `type` 決定模式：

- 無 `type`：Reading
- `type: quiz`：Exam
- `type: slides`：Slides

完整格式規格請看 [docs/template-spec.md](docs/template-spec.md)。

## Docs

- [AGENTS.md](AGENTS.md)：專案規格、開發規範、repo-local skills
- [docs/roadmap.md](docs/roadmap.md)：完整 roadmap 與各子階段驗收標準
- [docs/progress.md](docs/progress.md)：目前進度
- [docs/decisions.md](docs/decisions.md)：架構決策紀錄
- [docs/task-plan/task-plan.json](docs/task-plan/task-plan.json)：任務清單

## Repo Layout

- `frontend/`：Next.js 前端應用與前端容器設定
- `backend/`：後端服務預留位置
- `docs/`：roadmap、progress、ADR、template spec
- 根目錄：repo 文件與 `docker-compose.yml`

## Development Workflow

此專案採 Docker-first 開發方式，原則上不在本機安裝專案依賴。  
標準流程會以 `docker compose` 執行開發、lint、test、build。

目前可直接使用以下容器指令：

- `docker compose up app`
- `docker compose run --rm app pnpm lint`
- `docker compose run --rm app pnpm test`
- `docker compose run --rm app pnpm build`

前端應用實體檔案位於 `frontend/`，但仍由根目錄的 `docker-compose.yml` 統一啟動。

## AI Workflow

本 repo 包含 repo-local skills，放在 `.agents/skills/`，用來輔助：

- 架構決策
- parser 規格實作
- UI / UX 一致性
- 子階段驗收與 git workflow

## License

尚未決定。
