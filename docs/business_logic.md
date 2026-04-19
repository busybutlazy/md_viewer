# Business Logic

本文件描述目前 `Markdown Reader Pro` 已實作的核心業務規則。  
以「使用者看見的行為」與「系統內部如何判定」為主，不重複實作細節。

---

## 1. 文件載入規則

### 1.1 載入來源

目前有兩種入口：

- Upload：使用者拖放或選取本機 `.md` / `.markdown` / `.txt`
- Sample：首頁載入內建範例檔

兩者都會走同一條流程：

1. 讀取 markdown 內容
2. 呼叫 parser 解析 frontmatter 與模式
3. 寫入 document store
4. 導向對應 route

### 1.2 模式判定

由 frontmatter 的 `type` 決定：

- `type: quiz` → `/exam`
- `type: slides` → `/slides`
- 其他值或缺省 → `/read`

### 1.3 文件狀態保存

- document store 使用 `sessionStorage`
- 同一個 tab 重新整理後仍保留目前文件
- 若直接開啟模式頁但 store 為空，會回首頁並提示

### 1.4 載入新 quiz 的規則

- 每次從首頁 upload 或 sample 載入新文件前，都會先清空 exam session
- 目的：避免舊題庫的提交狀態或答案污染新卷

---

## 2. Reading Mode 規則

### 2.1 閱讀模式啟用條件

- 當文件不是 `quiz` / `slides` 時，自動視為 reading document

### 2.2 顯示內容

- frontmatter 可顯示 `title`、`author`、`date`、`tags`
- markdown 內容使用共用 `MarkdownView` 渲染
- heading 會產生穩定 id，支援 TOC 與 hash 導航

### 2.3 日期處理

- YAML frontmatter 若把 `date` 解析為 `Date`，系統會先正規化成字串
- 目標格式為 `YYYY-MM-DD`
- UI 不直接 render `Date` 物件

---

## 3. Exam Mode 規則

### 3.1 Quiz 格式

每題採結構化格式：

```md
## Q1
type: single
answer: B

題目文字

A. 選項 A
B. 選項 B

> 解析: 詳解
```

### 3.2 題型與答案

- `type: single`：單選題
- `type: multi`：複選題
- `answer: B`：單選答案
- `answer: [B, D]`：複選答案

validator 會檢查：

- 是否缺少 `type`
- 是否缺少 `answer`
- `type` 是否為 `single` / `multi`
- `answer` 是否指向存在的選項
- `single` / `multi` 是否與答案數量一致

### 3.3 作答 session

exam session 保存：

- 題目顯示順序
- 各題選項顯示順序
- 使用者答案
- 開始時間
- 截止時間
- 是否已提交

保存位置：

- `sessionStorage`

### 3.4 shuffle 規則

`shuffle` 與 `shuffleOptions` 只影響**顯示順序**，不改變內部 canonical id。

系統區分兩層 identity：

- canonical identity
  - `question.id`
  - `option.id`
  - 給 parser、store、判分使用
- display identity
  - `Q1`、`Q2`、`Q3`
  - `A`、`B`、`C`、`D`
  - 給作答 UI 使用

### 3.5 顯示規則

即使 shuffle 開啟：

- 作答頁題號仍一律顯示為連續 `Q1`、`Q2`、`Q3`
- 每題選項仍一律顯示為目前順序下的 `A`、`B`、`C`、`D`

這代表：

- 題目可以換順序
- 選項可以換順序
- 但答題者看到的編號永遠保持直觀

### 3.6 判分規則

- 單選：使用者選到唯一正解才算對
- 複選：使用者選取集合必須與正解集合完全相同
- 不提供部分分數
- 最終分數 = `答對題數 / 總題數 * 100`，四捨五入為整數

### 3.7 提交規則

可以提交的方式：

- 使用者手動提交
- 倒數計時到 0 自動提交

提交後：

- 寫入 `submittedAt`
- 導向 `/exam/result`

### 3.8 再次開啟同一份題庫

- 若同一份 quiz 尚未提交，保留原本 session
- 若同一份 quiz 已提交，再次開啟時會重建新 session

### 3.9 結果頁顯示規則

- 結果頁題號顯示使用作答順序的連續編號
- 結果頁不顯示選項代號
- 「你答」與「正解」只顯示選項文字內容

這樣做是為了避免 shuffle 後，顯示 label 與原始 option id 混淆。

---

## 4. Slides Mode 規則

### 4.1 Slides 格式

- `type: slides`
- 以單獨一行的 `---` 分頁
- code fence 內的 `---` 不算分頁符
- `<!-- speaker: ... -->` 會抽成 speaker notes

### 4.2 顯示行為

- 支援單頁投影片舞台
- 支援 keyboard navigation
- 支援 overview
- 支援 speaker notes
- 支援 fullscreen
- 支援 `window.print()` 匯出 PDF

### 4.3 顏色規則

- slide theme 決定該張投影片的主要文字顏色
- slide 內 prose 需繼承 slide theme，而不是強制套用全域閱讀文字色

---

## 5. 技術性保護規則

### 5.1 Hydration 保護

document store 與 exam session store 都有 hydration gate：

- 在 persisted state 還原前，不渲染依賴 store 的模式頁內容
- 避免 server render 與 client restore 不一致造成 hydration mismatch

### 5.2 Dev 環境 `.next` 隔離

Docker compose 的 app service 已將 `/app/.next` 獨立成容器內 volume。

目的：

- 避免宿主機 bind mount 與 `next dev` / `next build` 共用同一份 `.next`
- 降低 dev server chunk / manifest 壞掉的機率
