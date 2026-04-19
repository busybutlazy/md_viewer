# Roadmap

本文件是所有子階段的完整規格與驗收標準。`CLAUDE.md` 的 Roadmap 表是摘要，以本文件為準。

**階段標記規則**：`P<主階段>.<子階段>`。例：`P1.4` = 階段 1 子階段 4。

**共通的驗收程序**（每個子階段結束時）：
1. `pnpm lint` 通過，零 warning
2. `pnpm test` 通過（若該子階段涉及可測試邏輯）
3. `pnpm build` 通過
4. 逐條對照本文件的「驗收標準」手動驗證
5. `git-workflow-specialist` 建立 commit
6. 更新 `docs/progress.md`
7. 更新 `CLAUDE.md` 頂部「當前階段」行

---

## 階段 1：網頁上傳檔案版

**階段目標**：驗證三個模式的核心邏輯與 UX。此階段是純邏輯與 UI 的實驗室，不處理檔案系統。

### P1.0 專案初始化

**任務**：
- 以 `create-next-app` 建立 Next.js 15 專案（App Router、TypeScript、Tailwind、src 目錄、ESLint）
- 配置 `tsconfig.json` strict 模式
- 配置 Prettier + ESLint 整合
- 安裝 Vitest + React Testing Library
- 建立 `CLAUDE.md` 規範的目錄結構（空殼）
- `next/font` 引入 Noto Sans TC、Inter、JetBrains Mono
- 建立 `docs/progress.md` 與 `docs/decisions.md` 骨架
- 配置 `.gitignore`、`.editorconfig`

**驗收標準**：
- `pnpm dev` 啟動後首頁能看到「Markdown Reader Pro」標題
- `pnpm lint` / `pnpm test` / `pnpm build` 全通過
- 三個字型在首頁正常顯示（各放一個範例文字驗證）

**Commit**：`chore(p1.0): 初始化專案與依賴`

---

### P1.1 設計系統基礎

**任務**：
- 在 `tailwind.config.ts` 定義色彩 tokens（依 `ui-ux-designer.md` 規範）
- 建立 `frontend/src/app/globals.css` 的 CSS 變數與 dark mode class
- 建立 AppShell layout：topbar（logo + 模式 badge + 回首頁按鈕）
- 建立共用 UI 元件：Button、Card、Badge、Toast、Dialog（shadcn/ui 安裝對應）
- Dark mode toggle（存 localStorage + 跟隨系統預設）

**驗收標準**：
- 亮/暗模式切換正常、重整後保留
- 系統深色偏好預設生效
- 每個基本 UI 元件有亮暗兩版視覺
- 手機尺寸（375px）layout 不破版

**Commit**：`feat(p1.1): 建立設計系統與共用 UI 元件`

---

### P1.2 Markdown parser 完整實作

**任務**：
- `frontend/src/lib/parsers/frontmatter.ts`：包 `gray-matter`
- `frontend/src/lib/parsers/detect-mode.ts`：依 `type` 欄位決定模式
- `frontend/src/lib/parsers/quiz.ts`：markdown → `Quiz` 結構
- `frontend/src/lib/parsers/slides.ts`：markdown → `SlideDeck` 結構
- `validateQuiz` / `validateSlides` 警告函式
- 所有 parser 配 Vitest 測試與 fixture `.md` 檔，放 `frontend/src/lib/parsers/__tests__/`
- 涵蓋 `docs/template-spec.md` 列出的所有邊界條件

**驗收標準**：
- 測試覆蓋率：parser 邏輯 > 90%
- 所有邊界條件測試通過
- 給我一份故意寫錯格式的 `.md`，不會 crash，回傳合理的警告

**Commit**：`feat(p1.2): 實作 markdown parser 與完整測試`

---

### P1.3 檔案上傳與狀態管理

**任務**：
- `frontend/src/lib/store/document.ts` Zustand store（`persist` middleware → sessionStorage）
- 首頁上傳區（`react-dropzone`，支援 drag-and-drop 與點擊選檔）
- 接受 `.md` / `.markdown` / `.txt`，其他檔案類型顯示 toast 錯誤
- 上傳 → parse frontmatter → detect mode → 存進 store → 自動路由到對應模式頁
- Parse 警告用 banner 顯示於目標頁面頂部

**驗收標準**：
- 拖一個 `type: quiz` 的檔案進來，自動跳到 `/exam`
- 刷新頁面後 store 內容還在（sessionStorage 生效）
- 上傳錯檔案類型顯示明確錯誤訊息
- 路由直接打 `/read` 但 store 為空 → 重導回 `/` 並提示

**Commit**：`feat(p1.3): 建立檔案上傳流程與 document store`

---

### P1.4 閱讀模式

**任務**：
- `/read` 頁面與 layout
- `MarkdownView` 元件：`react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-highlight`
- 客製元件：
  - `CodeBlock`（copy 按鈕、語言標籤、hover 顯示、亮暗雙版 theme）
  - `Heading`（H1–H6，hover 顯示錨點連結）
  - `ProseImage`（圓角、alt → caption、lazy loading）
  - `TableOfContents`（右側 sticky，掃描頁面 H2/H3 自動生成、當前項目高亮）
  - `ReadingProgress`（top bar 顯示捲動進度）
- `frontend/src/styles/prose.css` 微調 Tailwind Typography

**驗收標準**：
- 用一份 1500 字、含多種元素（code、table、image、list、blockquote）的文章測試
- 亮暗兩模式字級、行高、對比度都舒適
- TOC 點擊跳轉正確，長文捲動時當前段落 highlight
- 手機版 TOC 收合成浮動按鈕（或完全隱藏，不擋內容）
- 所有 heading 有 `id`，URL 加 `#heading-id` 可直達

**Commit**：`feat(p1.4): 實作閱讀模式與 typography`

---

### P1.5 考試模式 — 作答流程

**任務**：
- `/exam` 頁面
- `frontend/src/lib/store/exam-session.ts` Zustand store（`persist` → sessionStorage）
- 元件：
  - `QuestionCard`：包 question text + options + 作答狀態顯示
  - `OptionItem`：單選 radio / 複選 checkbox，自動依 `isMulti` 切換
  - `ExamProgressBar`：頂部固定，顯示已答 / 總數
  - `ExamTimer`：右上，剩餘時間，< 30s 變紅，歸零自動提交
  - `SubmitConfirmDialog`：提交前若有未作答，列出題號 + 跳轉連結
- 選項點擊區延伸到整個選項（`<label>` 包 `<input>`）

**驗收標準**：
- 單選、複選題在 UI 上清楚區分
- 已作答的選項狀態刷新頁面後仍保留
- 計時器到 0 自動提交並跳轉結果頁
- 鍵盤可操作（Tab / Space / Arrow 選擇）
- 手機版選項區域大到好點

**Commit**：`feat(p1.5): 實作考試模式作答流程`

---

### P1.6 考試模式 — 結果頁

**任務**：
- `/exam/result` 頁面
- 分數計算邏輯（單選完全匹配、複選集合相等、無部分分數）
- 結果頁結構：
  - 頂部 hero：大分數、pass/fail badge（若有 `passingScore`）、用時
  - 「錯題（N）」區塊，預設展開，含題目 + 你的答案 + 正解 + 詳解
  - 「已答對（N）」區塊，預設收合
- 詳解用 `MarkdownView` 渲染（不要 fork markdown 渲染邏輯）
- 「重新作答」按鈕：清除 exam-session、跳回 `/exam`
- 「回首頁」清除 document store 與 exam-session

**驗收標準**：
- 錯題正確識別、置頂、清楚標示「你答：X / 正解：Y」
- 詳解內的 code block、連結、圖片都正常渲染
- 重新作答後題目順序保留（除非 `shuffle: true`）
- 結果頁 `aria-live` 設置正確

**Commit**：`feat(p1.6): 實作考試結果頁與錯題詳解`

---

### P1.7 簡報模式

**任務**：
- `/slides` 頁面
- 元件：
  - `SlideFrame`：固定 aspect ratio（預設 16:9），字體 scale 用 CSS 變數可覆寫
  - `SlideNavigator`：底部浮動控制列（頁碼、前後按鈕、縮圖、全螢幕、講者模式、總覽）
  - `SpeakerNotes`：講者模式專用面板
  - `SlideOverview`：按 `O` 開啟的 3 欄縮圖網格
- 鍵盤控制：`←` `→` `PageUp` `PageDown` `Space`（切頁）、`F`（全螢幕）、`ESC`（退出）、`S`（講者）、`O`（總覽）、`Home` `End`
- 三個主題：`default` / `dark` / `minimal`（CSS 變數切換）
- PDF 匯出：`@media print` stylesheet，每頁一張投影片（`page-break-after: always`）

**驗收標準**：
- 鍵盤流暢切頁，不會連跳多張
- 全螢幕 F 鍵正確進入/退出，chrome 3 秒後自動隱藏
- 講者模式顯示下一頁預覽 + 備忘
- `window.print()` 輸出的 PDF 一頁一張投影片、無 chrome
- Parser 正確處理 code block 內的 `---`（**必須由 P1.2 測試涵蓋**）
- 主題切換即時生效

**Commit**：`feat(p1.7): 實作簡報模式與基本匯出`

---

### P1.8 首頁 polish + 範例檔

**任務**：
- 首頁完整設計：
  - Hero：應用名稱 + 一句 tagline + 三個模式小圖示
  - 上傳區：大、居中、hover 狀態明顯
  - 範例卡片：三張（閱讀、考試、簡報各一），點擊直接載入對應範例檔
  - Footer：最小化（GitHub 連結、版本）
- 建立三份高品質範例：
  - `frontend/samples/reading-sample.md`：一篇 1500+ 字的技術文章，展示閱讀模式最美的樣子
  - `frontend/samples/exam-sample.md`：10 題選擇題（含 2 題複選），覆蓋各種詳解格式
  - `frontend/samples/slides-sample.md`：12 頁簡報，展示所有主題與排版特色

**驗收標準**：
- 範例檔內容本身具備示範價值（不是 lorem ipsum）
- 點擊範例卡 → 2 秒內進入對應模式
- 首頁在 375px、768px、1280px 都好看
- 空狀態與 loading 狀態都有處理

**Commit**：`feat(p1.8): 完成首頁與範例檔`

---

### P1.9 階段 1 驗收與修整

**任務**：
- 收集 20 份真實的 `.md` 檔（各模式都要）丟進去測
- 記錄所有 bug / 體驗不順 於 `docs/progress.md`
- 修完能修的，排除不能修的
- 更新 README（給使用者看的），包含快速開始、支援的 markdown 格式、已知限制
- 確認測試覆蓋率達標

**驗收標準**：
- 20 份檔案都能正常開啟與操作，無 crash
- README 完整，連新使用者能在 5 分鐘內跑起來
- 本階段所有子階段 commit 都存在且格式正確

**Commit**：`chore(p1.9): 階段 1 驗收與文件更新`

---

## 階段 1.5：下載式編輯

**階段目標**：在不接觸檔案系統的前提下，讓使用者能編輯 markdown 並輸出。

### P1.5.1 編輯器整合

**任務**：
- 安裝 CodeMirror 6（`@codemirror/view`、`@codemirror/lang-markdown` 等）
- 新增 `/edit` 路由（或在閱讀模式頁加「編輯」toggle，決定權在 `frontend-architect`）
- 左右分割：左邊 CodeMirror，右邊即時預覽（重用 `MarkdownView`）
- 同步捲動（可選，先做簡單版）
- 編輯器 dark mode 與專案主題對齊

**驗收標準**：
- 輸入時右側預覽 < 100ms 更新
- CodeMirror 主題與專案整體 UI 協調
- 基本編輯體驗：語法高亮、括號配對、自動縮排
- 手機版改用上下分割（上編輯、下預覽）或 tab 切換

**Commit**：`feat(p1.5.1): 整合 CodeMirror 編輯器與即時預覽`

---

### P1.5.2 下載機制

**任務**：
- 「下載 `.md`」按鈕
- 實作：`Blob` + `URL.createObjectURL` + `<a download>`
- 檔名：優先用 frontmatter `title`（slugify），fallback 為原檔名，再 fallback 為 `untitled-<timestamp>.md`
- 未儲存變更指示器（title bar 顯示 `●`，document.title 也加）
- 離開頁面警告（`beforeunload`），有變更時彈出
- `Cmd/Ctrl+S` 快捷鍵觸發下載

**驗收標準**：
- 下載的 `.md` 能再次上傳回來，內容一模一樣
- 中文檔名正確處理（不變 `%E4%B8%AD%E6%96%87`）
- 未存檔警告不會誤觸（關掉 tab 時才彈）

**Commit**：`feat(p1.5.2): 新增 markdown 下載功能`

---

### P1.5.3 新建檔案

**任務**：
- 首頁加「新建 `.md`」按鈕，彈出模版選擇：
  - 空白（一行 `# `）
  - 閱讀（含 frontmatter title）
  - 考試（含 frontmatter + 1 題範例）
  - 簡報（含 frontmatter + 3 頁範例）
- 選完後直接進 `/edit` 模式
- 每個模版的骨架內容存在 `frontend/src/lib/templates/` 裡

**驗收標準**：
- 四個範本都能成功進入編輯器
- 考試與簡報範本的骨架本身符合 parser 格式（生成的檔案能直接切去對應模式看）

**Commit**：`feat(p1.5.3): 支援從範本新建 markdown`

---

## 階段 2：網頁授權資料夾版

**階段目標**：驗證「檔案系統接入」後的體驗，成為真正的日常工具。

### P2.0 檔案系統抽象層（重構）

**任務**：
- 建立 `frontend/src/lib/fs/types.ts`：定義 `FileSystemAdapter` interface
  ```ts
  interface FileSystemAdapter {
    type: 'upload' | 'fsaccess' | 'node'
    list(): Promise<FileNode[]>
    read(path: string): Promise<string>
    write(path: string, content: string): Promise<void>
    create(path: string): Promise<void>
    delete(path: string): Promise<void>
    watch?(callback: (events: FileEvent[]) => void): () => void
    refresh(): Promise<void>
  }
  ```
- 實作 `UploadAdapter`：延續 P1.3 的上傳邏輯（list 回傳單一檔案）
- 實作 `DownloadAdapter`（P1.5 的下載）作為 write 的預設實作
- 重構 document store 改為透過 adapter 取得檔案內容
- **本 commit 不新增使用者可見功能，純重構**

**驗收標準**：
- 所有 P1 / P1.5 功能完全正常（用 UploadAdapter + DownloadAdapter）
- 沒有任何地方繞過 adapter 直接操作 File 物件
- adapter 有型別測試（給 mock 實作跑看看）

**Commit**：`refactor(p2.0): 建立檔案系統抽象層`

---

### P2.1 File System Access API adapter

**任務**：
- 實作 `FSAccessAdapter`，包 `showDirectoryPicker` / `FileSystemDirectoryHandle`
- 用 `idb-keyval`（或直接 IndexedDB）存取 handle
- 啟動時嘗試從 IDB 讀回 handle，呼叫 `requestPermission({ mode: 'readwrite' })` 驗證
- 偵測瀏覽器支援：`'showDirectoryPicker' in window`
- 不支援時 adapter 不註冊，fallback 到 upload

**驗收標準**：
- Chrome：第一次授權後重整頁面仍保留授權
- Chrome：手動在網址列撤銷權限後，app 能優雅處理（顯示「授權失效，請重新授權」）
- Safari / Firefox：偵測到不支援，UI 不顯示「選擇資料夾」按鈕
- 授權一次讀寫（不是兩次），使用者心智模型要一致

**Commit**：`feat(p2.1): 整合 File System Access API 與授權持久化`

---

### P2.2 資料夾樹側邊欄

**任務**：
- `FolderTree` 元件：遞迴列出所有 `.md` / `.markdown`
- 忽略：隱藏檔（`.*`）、`node_modules`、二進位檔
- 點擊檔案 → 讀入 → parse → 導向對應模式
- 當前檔案高亮
- 搜尋框：檔名 fuzzy search
- 資料夾 / 展開收合狀態記憶（sessionStorage）
- 側邊欄可拖曳調整寬度 + 可收合

**驗收標準**：
- 1000 個檔案的資料夾載入 < 1 秒（測試用真實倉庫如 Obsidian vault）
- 切換檔案時閱讀進度 / 作答狀態正確重置
- 深層巢狀資料夾視覺層次清楚
- 手機版：側邊欄變 drawer

**Commit**：`feat(p2.2): 實作資料夾樹側邊欄與檔案瀏覽`

---

### P2.3 授權管理 UI

**任務**：
- 首頁根據環境顯示不同主 CTA：
  - 支援 FS Access API：「選擇資料夾」主按鈕 + 「上傳單檔」次要選項
  - 不支援：「上傳單檔」為主，顯示提示「想要瀏覽整個資料夾？請使用 Chrome 或 Edge」
- 已授權狀態：topbar 顯示資料夾名稱 + 下拉選單（切換資料夾、清除授權）
- 切換資料夾：關閉當前、重新呼叫 picker
- 清除授權：IDB 清掉、document store 清掉、回到首頁

**驗收標準**：
- 新使用者第一眼理解兩個選項的差異
- Safari 使用者不會看到「選擇資料夾」卻按了沒反應
- 清除授權後，下次開啟真的要重新選（不能靜默恢復）

**Commit**：`feat(p2.3): 實作授權管理 UI 與瀏覽器 fallback`

---

### P2.4 寫回檔案

**任務**：
- 擴充 `FSAccessAdapter.write` 真正寫回原檔
- 編輯器 tab 標題顯示 `●` 當有未存變更
- `Cmd/Ctrl+S` 快捷鍵呼叫 write（取代 P1.5.2 的下載）
- 在 FS Access 模式下，「下載」按鈕改為「儲存副本」
- 寫入失敗（權限撤銷、磁碟滿）的錯誤處理 + toast

**驗收標準**：
- 編輯 → Cmd+S → 檔案系統上的檔案真的更新
- 外部編輯器同時打開同一檔，儲存後能偵測到（或至少不會把對方的改動覆蓋掉而無聲無息）—— 這個要設計決策：可先做「總是覆蓋」但提示
- 未存變更時關 tab 有警告

**Commit**：`feat(p2.4): 實作編輯後寫回原檔`

---

### P2.5 重新整理、新建、刪除

**任務**：
- 側邊欄「重新整理」按鈕：重新 list 當前資料夾
- 側邊欄右鍵（或 hover 出現 + 按鈕）選單：
  - 新建檔案：彈窗輸入檔名，套用 P1.5.3 的模版選單
  - 刪除檔案：二次確認 dialog
  - 重新命名（可選，複雜度較高）
- 新建時 adapter 直接寫入空檔 + 模版內容

**驗收標準**：
- 外部用 VSCode 新增一個檔案 → 按重新整理 → 樹中出現
- 刪除有明確 undo 提示（或至少確認對話框無法誤觸）
- 新建檔案後自動進入編輯模式

**Commit**：`feat(p2.5): 支援資料夾重新整理、新建、刪除`

---

### P2.6 階段 2 驗收

**任務**：
- **自己用一週**，用你自己的真實筆記資料夾
- 記錄所有痛點到 `docs/phase2-notes.md`
- 分類：
  - 可以當下修的 bug → 立刻修
  - 可以進階段 3 解決的（需要桌面能力的） → 列入 P3 計畫
  - 設計決策錯誤 → 寫進 `docs/decisions.md`
- 更新 README

**驗收標準**：
- `docs/phase2-notes.md` 至少 500 字的真實使用心得
- 決定是否繼續進入階段 3（有可能你會發現階段 2 已經夠用）

**Commit**：`chore(p2.6): 階段 2 驗收與心得記錄`

---

## 階段 3：桌面應用程式（Electron）

**階段目標**：成為真正無縫的日常工具，解鎖階段 2 做不到的能力。

### P3.0 Electron 專案結構

**任務**：
- 安裝 `electron`、`electron-builder`、`concurrently`、`wait-on`
- 建立 `electron/` 資料夾：
  - `main/index.ts`：主行程入口
  - `preload/index.ts`：preload script，透過 `contextBridge` 暴露安全 API
  - `shared/types.ts`：main 與 renderer 共用型別
- 配置 Next.js 為靜態匯出（`output: 'export'`）或採 `next-electron-server`（由 `desktop-integration-specialist` 決定）
- 調整 `frontend/package.json` scripts：`electron:dev`、`electron:build`
- 配置 `electron-builder.yml`：app id、產品名、輸出目錄

**驗收標準**：
- `pnpm electron:dev` 能開起視窗顯示首頁
- 打包能生成你目前平台的安裝檔（不簽章沒關係）

**Commit**：`chore(p3.0): 建立 Electron 專案結構`

---

### P3.1 主視窗與選單

**任務**：
- 主視窗：
  - 預設大小 1280×800，最小 800×600
  - 記住上次位置與大小（`electron-store`）
  - 標題跟隨當前檔案名
- 選單列：
  - 檔案：開啟資料夾、新建檔案、最近開啟、關閉
  - 編輯：還原、重做、剪下、複製、貼上、全選（基本）
  - 檢視：切換深色模式、切換全螢幕、放大/縮小
  - 視窗：最小化、縮放
  - 說明：關於、前往 GitHub
- macOS 特殊：
  - Dock 圖示、Cmd+Q 符合 macOS 習慣
  - 關閉主視窗不結束 app

**驗收標準**：
- macOS 使用者感覺這是原生 app（Dock、選單、快捷鍵都對）
- Windows 使用者沒有 macOS 式的彆扭（例如視窗控制鈕在正確位置）

**Commit**：`feat(p3.1): 實作主視窗與系統選單`

---

### P3.2 原生檔案系統 adapter

**任務**：
- 實作 `NodeFSAdapter`：main process 處理 `fs.promises` 操作，renderer 透過 IPC 呼叫
- `preload/index.ts` 用 `contextBridge.exposeInMainWorld` 安全暴露 API
- 啟動時在 renderer 偵測 `window.electron` 是否存在：
  - 存在 → 註冊 `NodeFSAdapter`
  - 不存在 → 用 P2 的 `FSAccessAdapter`（網頁模式）
- 所有網頁端程式碼**完全不動**

**驗收標準**：
- 網頁版（`pnpm dev`）仍正常運作
- Electron 版啟動時開啟資料夾，**沒有**任何授權對話框
- IPC 安全性審查：只暴露必要方法，不暴露整個 `fs` 模組
- 讀寫速度比網頁版明顯快（可觀察）

**Commit**：`feat(p3.2): 實作 Electron 原生檔案系統 adapter`

---

### P3.3 檔案監看

**任務**：
- 安裝 `chokidar`，在 main process 監看當前開啟的資料夾
- 檔案變動事件透過 IPC 推到 renderer
- Renderer 的 adapter 接收事件、更新 store、UI 即時反映
- 處理幾種情境：
  - 新增檔案：樹中自動出現
  - 刪除檔案：樹中消失，若為當前開啟檔提示「檔案已被刪除」
  - 修改檔案（外部）：若為當前開啟檔，提示「檔案已變更，要重新載入嗎？」
- 避免事件風暴：debounce 200ms

**驗收標準**：
- 開 Obsidian / VSCode 同時編輯，應用程式即時同步
- Git pull 進新檔案會自動出現在樹中
- 外部改動當前檔案時的 UX 不讓使用者意外丟失自己的未存變更

**Commit**：`feat(p3.3): 整合 chokidar 檔案監看`

---

### P3.4 最近開啟資料夾

**任務**：
- 最近 5 個資料夾存 `electron-store`
- 選單列「檔案 → 最近開啟」submenu，列出各路徑
- 首頁：若有最近紀錄，顯示快速開啟按鈕
- 清除紀錄選項

**驗收標準**：
- 切換資料夾後清單順序正確（最新在最上）
- 路徑已不存在時點擊有錯誤提示並從清單移除
- 清單顯示路徑的簡寫（`~/Documents/notes` 而非絕對路徑）

**Commit**：`feat(p3.4): 實作最近開啟資料夾清單`

---

### P3.5 打包與自用驗收

**任務**：
- `electron-builder` 打包你使用的平台（macOS `.dmg` 或 Windows `.exe`）
- 不簽章、不自動更新
- README 加「自行安裝說明」段落：
  - macOS：右鍵 → 開啟，首次會跳警告「無法驗證開發者」
  - Windows：SmartScreen 警告「更多資訊 → 仍要執行」
- 裝到日常使用機器上，用滿一週
- 記錄體驗於 `docs/progress.md`

**驗收標準**：
- 安裝 → 開啟 → 使用全部核心流程無 crash
- 一週下來，你願意繼續用它而非回到 Obsidian / VSCode
- 若有讓你痛苦的點，記錄下來決定是否進 P3.6

**Commit**：`chore(p3.5): 打包桌面應用程式並完成自用驗證`

---

### P3.6 進階整合（可選）

以下每個都是獨立子子階段，視需求取用，各自一個 commit：

- **P3.6.1 全域快捷鍵**：`Cmd/Ctrl+Shift+M` 喚起應用
- **P3.6.2 系統 tray**：常駐工具列圖示、快速開啟最近資料夾
- **P3.6.3 關聯 `.md` 檔**：作業系統把 `.md` 預設由本應用開啟
- **P3.6.4 原生通知**：簡報模式倒數、考試計時結束等
- **P3.6.5 深色模式跟隨系統**：Electron `nativeTheme` API
- **P3.6.6 多視窗**：允許同時開多個資料夾
- **P3.6.7 自動更新**（需要簽章 + 基礎設施，通常不做）

每個 commit：`feat(p3.6.x): <項目描述>`

---

## 跨階段不變的資產

以下在各階段幾乎不動，這是整個架構的穩定骨幹：

1. **Markdown parser**（`frontend/src/lib/parsers/`）：P1.2 定版
2. **渲染元件**（`MarkdownView`、`QuestionCard`、`SlideFrame`）：P1.4 – P1.7 定版
3. **考試與簡報的 UX 邏輯**：P1.5 – P1.7 定版
4. **設計 tokens**：P1.1 定版

**會變的只有「檔案從哪來、往哪去」這一層**。這就是 `FileSystemAdapter` 的價值。
