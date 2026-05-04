# Progress

本文件記錄開發進度。每個子階段完成後由 `git-workflow-specialist` 附加一筆。

**當前階段**：`P2.3`（待開始）— P2.2 資料夾樹側邊欄完成

---

## 格式

每筆紀錄格式：

```
## P<階段> — <子階段名稱>
**完成日期**：YYYY-MM-DD
**Commit**：<commit hash>
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- ...

### 遇到的問題
- ...

### 心得 / 決策
- ...

### 下一步
- 進入 P<下一階段>
```

---

## 日誌

## P2.2 — 資料夾樹側邊欄
**完成日期**：2026-05-05
**Commit**：待提交 `feat(p2.2): 實作資料夾樹側邊欄與檔案瀏覽`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `FolderTreeSidebar`，於 `AppShell` 全域顯示已授權資料夾的 markdown tree
- 支援遞迴資料夾、目前檔案高亮、Refresh、搜尋與空搜尋結果狀態
- 建立 `folder-session` store，使用 sessionStorage 保存搜尋與展開收合狀態
- 手機版提供 `Files` 按鈕與 drawer，不佔用主內容寬度
- 點擊檔案後透過 `FSAccessAdapter` 讀取、parse、導向對應模式
- 切換檔案時清除 exam session 並重置 slides session，避免跨文件狀態殘留
- 新增 `folder/tree.test.ts`，覆蓋 nested filter 與 1000 files count < 1 秒

### 遇到的問題
- `FolderTreeSidebar` 初版留下未使用的 toast hook，因 zero-warning lint 規則需移除
- build 會更新 `frontend/tsconfig.tsbuildinfo`，驗收後需還原避免把 build artifact 放進 commit

### 心得 / 決策
- P2.2 將側邊欄放在 AppShell，而非各模式頁，確保 read/exam/slides/edit 都可共用資料夾瀏覽
- 搜尋採 filename/path contains 的輕量方案；更完整 fuzzy ranking 可等實際使用後再評估

### 下一步
- 進入 P2.3 授權管理 UI

## P2.1 — File System Access API adapter
**完成日期**：2026-05-05
**Commit**：`8cfc8ea feat(p2.1): 整合 File System Access API 與授權持久化`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `FSAccessAdapter`，封裝 `showDirectoryPicker`、遞迴 list、read、write、create、delete、refresh
- 以直接 IndexedDB API 保存與恢復 `FileSystemDirectoryHandle`，不新增依賴
- 啟動首頁時嘗試恢復既有資料夾 handle，並用 readwrite permission 驗證授權
- 授權撤銷時清除 persisted handle 並顯示 toast，避免繼續使用失效狀態
- 首頁在支援瀏覽器顯示最小資料夾入口，不支援 `showDirectoryPicker` 時不顯示
- 選擇或恢復資料夾後，目前先載入第一個 markdown 檔；完整資料夾樹留到 P2.2
- 新增 `fs-access-adapter.test.ts`，覆蓋 markdown 篩選、忽略隱藏檔 / node_modules、路徑讀取與支援偵測

### 遇到的問題
- TypeScript DOM lib 沒有暴露 `FileSystemDirectoryHandle.entries()`，因此在 adapter 內用局部 `IterableDirectoryHandle` 型別補足
- jsdom 的 `File` mock 不穩定支援 `.text()`，測試改以最小 mock 物件提供 `text()`

### 心得 / 決策
- P2.1 不引入 `idb-keyval`，直接用 IndexedDB 保存 handle，維持依賴少且可控
- 授權流程統一要求 readwrite，一次完成讀寫心智模型；真正編輯寫回 UX 留到 P2.4

### 下一步
- 進入 P2.2 資料夾樹側邊欄

## P2.0 — 檔案系統抽象層
**完成日期**：2026-05-05
**Commit**：`5946727 refactor(p2.0): 建立檔案系統抽象層`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `frontend/src/lib/fs/types.ts`，定義 `FileSystemAdapter`、`FileNode`、`FileEvent` 等共用型別
- 建立 `UploadAdapter`，封裝目前上傳檔案、sample、template 的單檔讀取流程
- 建立 `DownloadAdapter`，作為目前瀏覽器下載 `.md` 的預設寫出策略
- document store 新增 `loadDocumentFromAdapter`，並記錄來源 adapter type / path
- 首頁上傳、空狀態上傳、sample cards、template 新建與 edit download 都改走 adapter
- 補上 `upload-adapter.test.ts` 與 document store adapter 載入測試

### 遇到的問題
- `UploadAdapter` 測試初版 mock 函式型別寫法不被 esbuild 接受，改成一般 `vi.fn()` mock
- document store 的載入狀態型別初版太寬，導致 `mode` 被推成可選；補上 `LoadedDocumentState` 收窄

### 心得 / 決策
- P2.0 只做純重構，不新增使用者可見功能；目前單檔上傳仍透過 `UploadAdapter`，寫出仍透過下載
- store 保留單一 parsed document source of truth，I/O 差異集中在 adapter 層，方便 P2.1 接 File System Access API

### 下一步
- 進入 P2.1 File System Access API adapter

## P1.5.3 — 從範本新建 markdown
**完成日期**：2026-05-04
**Commit**：`feat(p1.5.3): 支援從範本新建 markdown`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `frontend/src/lib/templates/index.ts`，定義空白、閱讀、考試、簡報四個模板
- 建立 `templates.test.ts`，驗證四個模板皆可 parse 且 0 warning
- 建立 `NewDocumentDialog` 元件（2×2 grid 選項卡 + 背景點擊關閉）
- 首頁加入 "New .md" 入口按鈕，位於 upload 區下方的 "or start from scratch" divider
- 選擇模板後呼叫 `loadDocument` 載入內容，直接 navigate 到 `/edit`

### 遇到的問題
- Quiz 模板初版用 checkbox list `- [x]` 格式，但 parser 只識別 `A. 選項` 格式；需將模板改為 `type: single / answer: C` 放在 `## Q1` 與題目文字之間
- 考試 parser 的 `type` 與 `answer` 欄位只在 `textLines.length === 0 && optionLines.length === 0` 時解析，因此必須放在選項行之前

### 心得 / 決策
- 模板測試涵蓋 parse 結果（mode、warnings、question/slide 數量），確保「從模板建出來的檔案能直接切去對應模式」這個驗收標準可重複驗證

### 下一步
- 階段 1.5 完成；進入 P2.0 檔案系統抽象層（重構）

## P1.5.2 — 下載機制
**完成日期**：2026-05-04
**Commit**：`feat(p1.5.2): 新增 markdown 下載功能`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `frontend/src/lib/editor/download.ts`：`slugifyTitle`（Unicode-aware）、`getDownloadFilename`（title → fileName → untitled-timestamp fallback）、`downloadMarkdown`（Blob + URL.createObjectURL）
- 補上 `download.test.ts`，9 個測試覆蓋 slugify 邊界與 filename fallback 邏輯
- Edit page 加入 toolbar：檔名顯示、「Download .md」按鈕
- `isDirty` 計算（content !== storedMarkdown，初始化完成後才生效）
- `document.title` 跟隨 isDirty 加入 `●` 前綴
- `beforeunload` 在 isDirty 時攔截關閉 tab
- `Cmd/Ctrl+S` 快捷鍵觸發下載

### 遇到的問題
- `isDirty` 若在 hydration 前計算會因 content="" 與 storedMarkdown=undefined 誤判為 dirty；加入 `initialized` state，等 useEffect 設定初始 content 後才啟用 isDirty

### 心得 / 決策
- slugify 以 `\p{L}\p{N}` Unicode property escape 保留中日韓字元，避免中文檔名被全部刪除
- `beforeunload` 只掛在 `isDirty === true` 時，避免誤攔截

### 下一步
- 進入 P1.5.3 從範本新建 markdown

## P1.5.1 — 編輯器整合
**完成日期**：2026-05-04
**Commit**：`feat(p1.5.1): 整合 CodeMirror 編輯器與即時預覽`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 安裝 `@uiw/react-codemirror`、`@codemirror/lang-markdown`、`@uiw/codemirror-theme-github`
- 建立 `EditorPane` 元件，封裝 CodeMirror 6；主題跟隨 `ThemeProvider` 的 `resolvedTheme` 自動切換 `githubLight` / `githubDark`
- 新增 `/edit` 路由：桌面左右分割（Editor｜Preview），手機上方 tab 切換
- Preview 重用既有 `MarkdownView`，editor `onChange` 直接觸發 preview 重渲染（< 100ms）
- AppShell nav bar 加入 Edit 連結；閱讀模式頁加入 Edit 按鈕
- 修正 `UploadTriggerButton` 的 variant 型別錯誤（pre-existing bug）
- 更新首頁測試以符合現在的 UI 文案

### 遇到的問題
- `useState(storedMarkdown)` 初始值在 hydration 前是 `undefined`；改以 `useEffect` 在 hydration 完成後設定初始 content
- CodeMirror 在 `"use client"` 元件中需要動態 import 或直接用 `@uiw/react-codemirror` wrapper，後者已包裝好 SSR fallback

### 心得 / 決策
- 使用 `@uiw/react-codemirror` React wrapper 而非裸 CodeMirror API，符合 P1 的快速驗證精神；CodeMirror 底層套件（view、state、commands）仍全數透過 wrapper 帶入
- editor 只維護 local state，不影響 document store；P1.5.2 的下載邏輯可直接從 edit page 的 content state 取得內容

### 下一步
- 進入 P1.5.2 下載 .md 功能

## P1.9 — 階段 1 驗收與修整
**完成日期**：2026-04-19
**Commit**：`fc604b9 chore(p1.9): 階段 1 驗收與文件更新`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 補上 `frontend/samples/acceptance/` 驗收樣本，搭配既有 sample 與 parser fixtures，建立 20+ 份 markdown acceptance corpus
- 新增 `phase1-acceptance.test.ts` smoke test，驗證三種模式文件都能 parse 且不會 crash
- 重新以 Docker 串行執行 `pnpm lint`、`pnpm test`、`pnpm build`，完成 phase 1 最終驗收
- 重寫 README，補齊快速開始、支援格式、phase 1 功能與已知限制
- 確認 `dev_jett/phase1` 上已包含 P1.3–P1.8 各子階段 commit，branch/commit 流程符合規範

### 遇到的問題
- `docker compose run --rm app` 若平行啟動多個驗收指令，容器內 `node_modules` volume 可能出現 `chown ENOENT` race，因此 phase 收尾改回串行執行
- 初版 warning sample 沒有命中既有 validator 規則，已調整為「無正解、無詳解」案例，避免 acceptance test 自己失真

### 心得 / 決策
- phase 1 驗收改成 repo 內可重跑的 markdown corpus + smoke test，比一次性人工開檔更可靠
- README 明確標註 phase 1 邊界，避免把 phase 2 的資料夾授權能力誤解成已完成

### 下一步
- 進入 P1.5.1 下載式編輯

## P1.8 — 首頁 polish 與範例檔
**完成日期**：2026-04-20
**Commit**：`d46c721 feat(p1.8): 完成首頁與範例檔`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 重做首頁 hero、上傳區、sample section 與 footer，讓首頁從 showcase 轉成產品入口
- 建立 `SampleCards`，直接重用 document store 與 routing 流程載入 sample 檔
- 補齊三份正式 sample：`reading-sample.md`、`exam-sample.md`、`slides-sample.md`
- 更新首頁測試，確認產品 hero、upload flow 與 sample 區塊都會渲染

### 遇到的問題
- sample 載入若重造資料流會跟 upload flow 分裂，因此改為直接共用 `loadDocument()` 與既有 route mapping
- 首頁舊測試綁定在 design-system preview 文案，需要一併改成產品首頁驗收點

### 心得 / 決策
- `P1.8` 的 sample cards 直接 fetch `public/samples/*`，讓使用者與未來文件都能共用同一批範例內容
- 首頁 CTA 先聚焦 upload 與 sample，不提前把 phase2 的 folder access 混進 phase1 主視覺

### 下一步
- 進入 P1.9 階段 1 驗收與修整

## P1.7 — 簡報模式
**完成日期**：2026-04-20
**Commit**：`61ba56a feat(p1.7): 實作簡報模式與基本匯出`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `SlideFrame`、`SlideNavigator`、`SpeakerNotes`、`SlideOverview` 與 `slides-session` store
- 重做 `/slides`，完成單張投影片舞台、speaker mode、overview、fullscreen 與底部控制列
- 實作鍵盤控制：`←` `→` `PageUp` `PageDown` `Space`、`Home` `End`、`F`、`ESC`、`S`、`O`
- 加入 fullscreen 中 3 秒無操作自動隱藏 chrome 的行為
- 建立 `slides.css` 與 print stylesheet，支援 `window.print()` 的基本 PDF 匯出
- 補上 `slides-session` store 測試，確保頁面索引與 overlay state 正常切換

### 遇到的問題
- `/slides` 初版同樣踩到 hooks 順序與型別 narrowing 問題，需先把 `deck` 安全收斂再執行 effects
- slides route 需要同時服務互動模式與 print deck，因此畫面版與列印版必須共用 `SlideFrame`，避免樣式漂移

### 心得 / 決策
- slides mode 仍重用 `MarkdownView`，只在 `slides.css` 內針對字級與 spacing 做 slide scope 覆寫
- overview 與 speaker mode 先保持輕量，不提前做多視窗 presenter mode，將範圍控制在 phase1
- print export 以 `window.print()` + `@media print` 完成，符合 P1.7 的基本匯出目標

### 下一步
- 進入 P1.8 首頁 polish 與範例檔

## P1.6 — 考試結果頁
**完成日期**：2026-04-20
**Commit**：`ecc781a feat(p1.6): 實作考試結果頁與錯題詳解`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `frontend/src/lib/exam/score.ts`，統一處理單選/複選完全匹配計分規則
- 重做 `/exam/result`，加入大分數 hero、pass/fail badge、用時、答題統計
- 完成錯題置頂區塊，顯示題目、你的答案、正解與詳解
- 以 `MarkdownView` 渲染詳解內容，沿用閱讀模式的 code block、連結、圖片與 typography 邏輯
- 建立已答對題目收合區塊，避免結果頁被正確題目淹沒
- 補上 `score` 純函式測試，鎖定無部分分數與未作答視為錯誤的規則

### 遇到的問題
- `MarkdownView` 導入結果頁後，`/exam/result` 的 client bundle 明顯變大，後續可再評估是否切分 explanation rendering
- 結果頁要同時兼顧答題摘要與詳解內容，若沒有錯題預設空畫面會很薄，因此補了 all-correct empty state

### 心得 / 決策
- 計分規則獨立成純函式後，P1.5 的 submit flow 與 P1.6 的結果頁不再互相耦合
- 詳解直接共用 `MarkdownView`，後續如果閱讀排版或 code block UX 有更新，結果頁會自動受益
- 錯題區塊加上 `aria-live=\"polite\"`，讓結果頁在提交後更符合 roadmap 的可達性要求

### 下一步
- 進入 P1.7 簡報模式

## P1.5 — 考試模式作答流程
**完成日期**：2026-04-19
**Commit**：`4a36205 feat(p1.5): 實作考試模式作答流程`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `frontend/src/lib/store/exam-session.ts`，保存題目順序、選項順序、答案、deadline 與提交狀態到 `sessionStorage`
- 重做 `/exam` 頁面，完成單頁卷軸作答流程、單選/複選切換、提交前檢查與大面積可點擊選項
- 建立 `QuestionCard`、`OptionItem`、`ExamProgressBar`、`ExamTimer`、`SubmitConfirmDialog` 元件
- 依 quiz metadata 支援題目與選項 shuffle，並在刷新後保留順序與答案
- 實作倒數計時器，剩餘時間低於 30 秒改為紅色，歸零後自動提交並跳轉 `/exam/result`
- 補上 `exam-session` store 測試，並新增最小 `result` route 承接提交後導頁

### 遇到的問題
- `/exam` 初版在 early return 後才呼叫 hooks，會違反 hooks 順序規則，需先把 quiz 安全收斂再執行 hooks
- timer effect 中對 `deadlineAt` 的 narrowing 不會自動保留到內部函式，需先存成區域常數
- 結果頁返回首頁若用 `Link` 包 `Button` 會形成不好的互動語意，改為 `router.push()` 控制

### 心得 / 決策
- `exam-session` 把 quiz-specific order 與 answer state 鎖在同一份 store，後續 P1.6 做計分與錯題整理時會簡單很多
- `SubmitConfirmDialog` 先聚焦在未作答提醒與跳轉，不提前把結果頁邏輯塞進 P1.5
- `/exam/result` 在 P1.5 只負責承接提交流程與基本摘要，詳細結果結構留到 P1.6

### 下一步
- 進入 P1.6 考試結果頁

## P1.4 — 閱讀模式
**完成日期**：2026-04-19
**Commit**：`a525c48 feat(p1.4): 實作閱讀模式與 typography`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `MarkdownView` 共用渲染核心，整合 `react-markdown`、`remark-gfm`、`rehype-raw`、`rehype-highlight`
- 建立 `CodeBlock`、`Heading`、`ProseImage`、`TableOfContents`、`ReadingProgress` 等閱讀模式元件
- 完成 heading slug 萃取與重複 id 處理，支援 H1-H6 anchor 與 H2/H3 TOC 導覽
- 重做 `/read` 頁面，加入文章 hero、metadata、tag badges、warning banner 與 sticky TOC 版面
- 補齊 `frontend/src/styles/prose.css`，微調長文、表格、blockquote、task list、inline code 與 code block 樣式
- 新增 `frontend/samples/reading-deep-dive.md` 作為長文手動驗收 sample，並補上 heading extraction 測試

### 遇到的問題
- `useMemo` 初版放在 early return 後面，違反 hooks 順序規則，需改為先計算安全輸入
- `globals.css` 不能用 `@/styles/prose.css` alias，必須改成相對路徑匯入
- `react-markdown` 的 `img` `src` 型別比預期寬，需在進 `ProseImage` 前先收斂成字串

### 心得 / 決策
- `extractMarkdownHeadings()` 獨立成共用工具，未來可被 slides / editor preview 重用，而不是把 TOC 邏輯綁死在 `/read`
- `MarkdownView` 以共用渲染核心設計，後續 exam explanation 與 editor preview 能直接沿用
- 手機版 TOC 採浮動開關，不強制常駐側邊欄，避免擋內容

### 下一步
- 進入 P1.5 考試模式作答流程

## P1.3 — 檔案上傳與 document store
**完成日期**：2026-04-19
**Commit**：`a3851aa feat(p1.3): 建立檔案上傳流程與 document store`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `parse-document` 組裝層，統一串接 frontmatter、mode detection、quiz/slides parser 與 warning 驗證
- 建立 `frontend/src/lib/store/document.ts`，以 Zustand `persist` middleware 將 document 狀態保存到 `sessionStorage`
- 在首頁加入 `react-dropzone` 上傳區，支援 `.md`、`.markdown`、`.txt`，錯誤檔案類型以 toast 明確提示
- 上傳後依 frontmatter 自動導向 `/read`、`/exam`、`/slides`，並於目標頁頂部顯示 parse warnings
- 建立三個模式頁的空狀態守衛與 P1.3 placeholder，直接開啟空路由時會重導回首頁並提示
- 補上 `parse-document` 與 `document store` 測試，驗證 parse orchestration、store 寫入與 sessionStorage 持久化

### 遇到的問題
- `useSearchParams()` 在首頁 client upload panel 中需要包在 `Suspense` 內，否則 `next build` 會失敗
- `DocumentMode` 使用 `quiz` 而非 `exam`，導頁判斷若寫錯會在 typecheck 階段被擋下
- Docker compose 共用依賴 volume 時，不適合同時平行跑多個驗收命令；改為串行執行較穩定

### 心得 / 決策
- `parseDocument()` 讓上傳流程只 parse 一次，之後各模式頁直接消費 store 內容，避免重複解析
- P1.3 只做到導頁、持久化與 guard，模式頁本身維持輕量 placeholder，將 UI 深化留給 P1.4/P1.5/P1.7
- 空 store 統一回首頁並帶 query toast，避免各模式頁分別實作不同的空狀態邏輯

### 下一步
- 進入 P1.4 閱讀模式

## P1.2 — Markdown parser 與測試
**完成日期**：2026-04-18
**Commit**：`9784c0c feat(p1.2): 實作 markdown parser 與完整測試`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 `frontmatter`、`detect-mode`、`quiz`、`slides`、`validate` parser 模組
- 以純 TypeScript 實作題目 SHA-1 id 生成，避免瀏覽器端依賴 Node API
- 建立 parser fixtures 與邊界條件測試，涵蓋 quiz/slides 的主要格式坑點
- 以 Vitest coverage 驗證 parser 邏輯覆蓋率達 `98.64% statements / 94.31% branches`

### 遇到的問題
- `vitest` path alias 需要顯式配置，否則 parser 測試無法解析 `@/`
- 覆蓋率 provider 初次安裝版本與現有 `vitest` 不相容，需要對齊到 `3.2.4`

### 心得 / 決策
- parser 維持純函式，不做 I/O，也不依賴 Node-only runtime
- 先把 frontmatter 與 mode detection 鎖穩，再往 quiz/slides parser 擴展，能更快定位錯誤

### 下一步
- 進入 P1.3 檔案上傳與 document store

## P1.1 — 設計系統基礎
**完成日期**：2026-04-18
**Commit**：`324b8e1 feat(p1.1): 建立設計系統與共用 UI 元件`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立亮暗模式 design tokens、全域 CSS variables 與 shell 色彩系統
- 完成可持久化 theme provider、系統主題跟隨與 theme toggle
- 建立 AppShell 與 Button、Card、Badge、Dialog、Toast 基礎 UI 元件
- 更新首頁為設計系統展示頁，直接驗證元件、字型與互動狀態

### 遇到的問題
- Vitest 未自動讀取 `@/` alias，需要補 `resolve.alias`
- 頁面測試中的 toast demo 依賴 provider，測試需補上對應包裝

### 心得 / 決策
- 先用 repo 內 primitives 建立設計系統基底，避免在早期階段引入過多 UI 依賴
- Theme 以 `system` 為預設，再允許使用者覆寫成 `light` / `dark`

### 下一步
- 進入 P1.3 檔案上傳與 document store

## P1.0 — 專案初始化與容器化基礎
**完成日期**：2026-04-18
**Commit**：`bded8fb chore(p1.0): 初始化專案與依賴`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 Next.js 15 + React 19 + TypeScript strict + Tailwind CSS v4 專案骨架
- 接上 Vitest、Testing Library 與首頁字型驗證內容
- 建立前端 Dockerfile、docker compose 與容器內依賴安裝入口
- 補齊 `frontend/src/components`、`frontend/src/lib`、`frontend/src/styles`、`electron/`、`frontend/samples/` 空殼目錄

### 遇到的問題
- `pnpm` 在 bind mount 直接寫入 `node_modules` 時會出現 Docker Desktop 的 copyfile 錯誤
- `next build` 會自動調整 `tsconfig.json`，需接受其對 TypeScript 專案的建議值

### 心得 / 決策
- 依賴安裝改由 compose 的 named volume 承接，避免直接寫入 repo 掛載目錄造成不穩定
- 首頁先做最小但可驗證的品牌頁，P1.1 再進一步擴成完整設計系統

### 下一步
- 進入 P1.2 Markdown parser 與測試
