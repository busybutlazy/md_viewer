---
type: slides
title: Markdown Reader Pro · Feature Tour
theme: minimal
aspectRatio: "16:9"
---

# Markdown Reader Pro

一份 `.md` 檔案，四種呈現方式。

<!-- speaker: 開場重點：這個產品不是編輯器，而是閱讀與展示的工作流工具。讓內容從一個來源，流向多種使用場景。 -->

---

## 四種模式

| 模式 | frontmatter | 使用場景 |
|------|-------------|----------|
| Reading | *(無 type)* | 長文、文章、技術文件 |
| Exam | `type: quiz` | 練習題、測驗、複習 |
| Slides | `type: slides` | 簡報、課程、講義 |
| Edit | *(手動切換)* | 即時編輯、撰寫 |

<!-- speaker: 強調 frontmatter 決定一切。同樣的知識內容，只需改一行就能切換到完全不同的使用情境。 -->

---

## 核心架構

![四種模式概覽](/samples/images/modes.svg)

<!-- speaker: 這張圖說明了四個模式的定位。Reading 和 Slides 走 Magazine 風格，Exam 和 Edit 走 Documented Warmth 風格。 -->

---

## Reading Mode

- **Magazine 排版**：Newsreader 字型、印刷節奏感
- **目錄自動生成**：根據 heading 層級建立 TOC
- **閱讀進度**：滾動位置即時追蹤
- **語法高亮**：code block 支援多語言

```markdown
---
title: 我的文章
author: 作者名稱
date: 2026-05-10
tags: [react, typescript]
---

# 文章標題

正文內容...
```

<!-- speaker: Reading mode 是最常用的模式。frontmatter 不寫 type 就預設進入。 -->

---

## Exam Mode

**Frontmatter 範例：**

```yaml
---
type: quiz
title: JavaScript 測驗
passingScore: 70
timeLimit: 600
shuffle: true
shuffleOptions: true
---
```

**題目格式：**

```markdown
## Q1
type: single
answer: B

哪個不是 JavaScript 原始型別？

A. String
B. Array
C. Number

> 解析: Array 是物件型別，不是原始型別。
```

<!-- speaker: Exam mode 支援計時器、自動提交、錯題詳解。一份 markdown 就是一份完整的考卷。 -->

---

## Slides Mode

本簡報就是 Slides mode 的展示。

**核心語法：**

- 單獨一行的 `---` → 切頁
- `<!-- speaker: ... -->` → 講者備忘
- code fence 內的 `---` **不會**切頁（如右欄範例）

**鍵盤快捷鍵：**

| 鍵 | 動作 |
|----|------|
| `→` / `Space` | 下一頁 |
| `←` | 上一頁 |
| `S` | 講者模式 |
| `O` | 概覽模式 |
| `F` | 全螢幕 |

<!-- speaker: 目前這頁就是在講者模式中看到的版面。右邊應該顯示下一頁的縮圖和講者備忘。 -->

---

## Edit Mode

左欄編輯，右欄即時預覽。

**資料夾授權後可直接存回磁碟：**

1. 點選側邊欄 → 「開啟資料夾」
2. 選取包含 `.md` 的本地資料夾
3. 授予瀏覽器讀寫權限
4. 編輯後按 `⌘S` 或點擊 Save 直接覆寫原檔

**新建範本：** Reading · Exam · Slides · Edit

<!-- speaker: Edit mode 使用 CodeMirror 6 編輯器，支援 markdown 語法高亮。儲存採 File System Access API，完全不需要後端。 -->

---

## 圖片支援

![圖片功能說明](/samples/images/image-feature.svg)

<!-- speaker: 圖片支援分兩種情境。外部 URL 在任何模式都可用；資料夾模式下，相對路徑的本地圖片也會自動解析成 blob URL 顯示。 -->

---

## 本地圖片（資料夾模式）

開啟本地資料夾後，markdown 中的相對路徑圖片自動顯示：

```markdown
![圖表](./images/chart.png)
![封面](../assets/cover.jpg)
![架構圖](images/architecture.svg)
```

**運作原理：**

1. `FSAccessAdapter.readBlob(path)` 讀取二進位
2. `URL.createObjectURL(blob)` 轉換成 blob URL
3. `ProseImage` 非同步解析，成功後渲染
4. 切換文件時自動 `revokeObjectURL` 釋放記憶體

> **外部 URL**（`https://...`）在所有模式下均直接可用，不需要授權資料夾。

<!-- speaker: 這個功能讓使用者可以在本地用任何編輯器寫 markdown + 圖片，打開資料夾後直接看到完整的圖文排版。 -->

---

## 技術棧

| 層 | 技術 |
|----|------|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS 4 + CSS 變數 |
| State | Zustand + sessionStorage |
| Editor | CodeMirror 6 |
| File IO | File System Access API |
| Font | Newsreader + Noto Serif TC |

<!-- speaker: 完全 client-side，不需要後端。File System Access API 讓我們可以直接讀寫本地檔案。 -->

---

## 部署

**Docker（開發）：**

```bash
docker compose up app
# → http://localhost:3000
```

**Docker（正式，Raspberry Pi 等）：**

```bash
docker compose -f docker-compose.product.yml up -d --build
```

不需要本機安裝 Node 或 pnpm。

<!-- speaker: 整個專案採 Docker-first 開發流程。production compose 在 container 啟動時完整 build，適合長期掛機的 Raspberry Pi 或伺服器環境。 -->

---

## Thank You

同一份 `.md`，支撐更多實際使用情境。

**GitHub：** busybutlazy/md_viewer

<!-- speaker: 結尾可以 demo 一下開啟本地資料夾，讓聽眾看到側邊欄的資料夾樹狀結構。 -->
