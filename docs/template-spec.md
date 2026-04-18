# Markdown 模版規格（Template Spec）

本文件是三種模式 markdown 格式的**權威規範**。所有 parser、fixture、範例檔必須遵守這裡的規則。規則若需變更，請先修改本文件，再修改 parser 與測試。

---

## 共通規則

### Frontmatter

- 檔案最上方的 YAML 區塊，由 `---` 包夾
- 用 `gray-matter` 解析
- `type` 欄位決定模式：
  - `type: quiz` → 考試模式
  - `type: slides` → 簡報模式
  - 其他值或缺省 → 閱讀模式
- 空檔案、純 frontmatter 無內文都不應 crash，回傳合理預設

### 編碼

- UTF-8，支援中英日韓字符
- 換行：LF 與 CRLF 皆須容錯

---

## 1. 閱讀模式

### Frontmatter 欄位

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `title` | string | 否 | 顯示於 topbar 與 browser title |
| `author` | string | 否 | 顯示於 hero 區 |
| `date` | string (ISO 或 YYYY-MM-DD) | 否 | 顯示於 hero 區 |
| `tags` | string[] | 否 | 顯示為 badges |

### 內文規則

- 完整 GFM（GitHub Flavored Markdown）
- 支援：標題、段落、粗體、斜體、刪除線、清單、連結、圖片、程式碼區塊、行內程式碼、引用、表格、任務清單、腳註
- 支援 HTML passthrough（`rehype-raw`），使用者自行負責安全性（目前是本地檔案，風險低）

### 範例

```markdown
---
title: React 19 新特性
author: 小明
date: 2026-04-18
tags: [react, frontend]
---

# React 19 新特性概覽

React 19 帶來多項重要改進...

## Server Components

...

```js
function App() {
  return <div>Hello</div>
}
```
```

---

## 2. 考試模式

### Frontmatter 欄位

| 欄位 | 型別 | 必填 | 預設 | 說明 |
|------|------|------|------|------|
| `type` | `'quiz'` | ✅ | — | 必須為字串 `quiz` |
| `title` | string | 否 | 檔名 | 測驗標題 |
| `shuffle` | boolean | 否 | `false` | 打亂題目順序 |
| `shuffleOptions` | boolean | 否 | `false` | 打亂每題選項順序 |
| `passingScore` | number (0–100) | 否 | — | 及格分數；設定後結果頁顯示 pass/fail badge |
| `timeLimit` | number (秒) | 否 | — | 作答時限；0 或缺省為無限 |

### 題目結構

#### 題目 heading

- 格式：`## Q{數字}{冒號} 題目文字`
- **冒號支援半形 `:` 與全形 `：`**
- 題目數字由使用者自填（允許重複；parser 以出現順序重新編號）
- 題目文字可跨多行（到第一個選項前為止）

#### 選項

- 格式：`- [ ] 選項文字`（錯誤）或 `- [x] 選項文字`（正確）
- `x` 大小寫皆接受
- 選項順序由 markdown 順序決定（除非 `shuffleOptions: true`）
- 選項文字支援 inline markdown（粗體、斜體、inline code、連結）
- **有 ≥2 個選項標記 `[x]` → 視為複選題**
- **僅 1 個 `[x]` → 單選題**
- **0 個 `[x]` → 警告，但仍保留該題（使用者可能寫錯）**

#### 詳解

- 由 `> 解析:` 或 `> 解析：` 或 `> Explanation:` 開頭的 blockquote
- 冒號同樣支援全形/半形
- 可跨多段（每段都以 `> ` 開頭）
- 可包含 code block、inline code、粗體、連結、清單
- 無詳解時結果頁顯示「（無詳解）」

### Parser 輸出結構

```ts
interface Quiz {
  meta: {
    title: string
    shuffle: boolean
    shuffleOptions: boolean
    passingScore?: number
    timeLimit?: number
  }
  questions: Question[]
}

interface Question {
  id: string        // SHA-1 前 12 碼 of 題目文字（穩定）
  number: number    // 1-based，依出現順序
  text: string      // markdown 允許
  options: Option[]
  isMulti: boolean
  explanation?: string
}

interface Option {
  id: string        // 'a' | 'b' | 'c' ...（原始順序）
  text: string
  correct: boolean
}
```

### 計分規則

- **單選**：使用者選的 option.id === 唯一 `correct: true` 的 option.id
- **複選**：使用者選的 id 集合 === 所有 `correct: true` 的 id 集合（無部分分數）
- 分數 = 答對題數 / 總題數 × 100，四捨五入為整數

### 邊界條件（parser 必測）

1. 題目文字含冒號：`## Q1: 哪個 URL 是正確的: https://example.com`（冒號不應被誤判為結尾）
2. 選項含 square bracket：`- [ ] arr[0] 的型別`
3. 選項含 inline code：`` - [x] `useState` ``
4. 詳解含 fenced code block（`---` 或 `` ``` `` 都可能出現在程式碼裡，不可誤判）
5. 詳解含巢狀 blockquote：
   ```
   > 解析: 大多數情況...
   >
   > > 延伸閱讀：XXX
   ```
6. 沒有詳解的題目
7. 零題（只有 frontmatter）
8. 題號不連續或重複（`## Q1`、`## Q1`、`## Q3`）
9. 全部選項都正確 / 全部都錯誤
10. 複選題只有 1 個 `[x]`（degrade 成單選）
11. 全形冒號 `Q1：` 與半形 `Q1:` 混用
12. 超過 10 個選項（`a` – `z`）

### 範例

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

> 解析: array 是 object 的一種，不是原始型別。原始型別有
> string、number、boolean、null、undefined、symbol、bigint。

## Q2: 以下哪些是 ES6 新增的特性？（複選）

- [x] `let` / `const`
- [x] arrow function
- [ ] `var`
- [x] `Promise`

> 解析: `var` 是 ES5 以前就存在的。
>
> 其餘皆為 ES6（2015）引入。

## Q3：什麼是 React hook？

- [x] 在函式元件中使用 state 與生命週期的 API
- [ ] 一種 React 授權模式
- [ ] HTML 的新標籤
```

---

## 3. 簡報模式

### Frontmatter 欄位

| 欄位 | 型別 | 必填 | 預設 | 說明 |
|------|------|------|------|------|
| `type` | `'slides'` | ✅ | — | 必須為字串 `slides` |
| `title` | string | 否 | 檔名 | 簡報標題 |
| `theme` | `'default'` \| `'dark'` \| `'minimal'` | 否 | `'default'` | 主題 |
| `aspectRatio` | `'16:9'` \| `'4:3'` | 否 | `'16:9'` | 投影片長寬比 |

### 投影片分頁規則

- 以**單獨一行**的 `---`（3 個以上連字號、前後僅允許空白）分頁
- 第一個 frontmatter 結束後的 `---` 才是分頁符
- **程式碼區塊內的 `---` 不算分頁符**（parser 必須維護 fenced code 狀態）

### Fenced code 偵測細則

- 開啟：以 `` ``` `` 或 `~~~` 開頭（可有前導空白）
- 關閉：相同符號、相同數量、相同縮排
- 支援語言標記：`` ```js ``、`` ```python ``

### 講者備忘

- 以 `<!-- speaker: 備忘內容 -->` HTML 註解包覆
- 可跨多行
- 同一張投影片多個備忘會以 `\n\n` 合併
- 從渲染內容中移除，抽出到 `speakerNotes` 欄位

### Parser 輸出結構

```ts
interface SlideDeck {
  meta: {
    title: string
    theme: 'default' | 'dark' | 'minimal'
    aspectRatio: '16:9' | '4:3'
  }
  slides: Slide[]
}

interface Slide {
  index: number          // 0-based
  content: string        // 移除備忘後的原始 markdown
  speakerNotes?: string
}
```

### 邊界條件（parser 必測）

1. 程式碼區塊內有 `---`（經典坑）：
   ````markdown
   # 第一頁
   
   ```yaml
   ---
   name: example
   ---
   ```
   
   ---
   
   # 第二頁
   ````
   應該只分 2 頁（第一頁的 yaml 內部 `---` 不算）
2. Tilde 圍起的程式碼區塊：`~~~` 也要偵測
3. 空投影片（只有空白）：略過不算頁
4. 講者備忘跨多行：
   ```
   <!-- speaker: 第一句話
   第二句話 -->
   ```
5. 同一頁多個 `<!-- speaker: -->`：合併
6. 只有 frontmatter，沒有任何內容：回傳 `slides: []`
7. 沒有 frontmatter 但有 `---` 分頁：應視為沒有 `type`，歸為閱讀模式（**不進此 parser**）
8. `---` 前後有空白字元（` ---  `）：仍視為分頁符
9. `----` 五個以上連字號：仍視為分頁符
10. 相鄰兩個 `---`（空白頁）：parser 略過空頁

### 範例

```markdown
---
type: slides
title: 我的簡報
theme: default
aspectRatio: "16:9"
---

# 封面標題

作者：XXX
日期：2026-04-18

---

## 大綱

- 介紹
- 內容
- 結論

<!-- speaker: 這裡提醒聽眾今天會涵蓋三大主題。 -->

---

## 程式碼示範

```yaml
---
server:
  port: 8080
---
```

<!-- speaker: 這頁的 --- 在程式碼區塊內，不是分頁符 -->

---

## 謝謝聆聽
```

---

## 驗證函式（validators）

parser 除了產出結構外，也產出警告陣列，供 UI 顯示給使用者：

```ts
interface ValidationResult {
  warnings: string[]      // 非致命，可繼續渲染
}

validateQuiz(quiz: Quiz): ValidationResult
validateSlides(deck: SlideDeck): ValidationResult
```

### Quiz 常見警告

- `第 3 題沒有正確選項（缺少 [x]）`
- `第 5 題與第 8 題題號皆為 Q5（已依順序重新編號）`
- `第 2 題沒有詳解`

### Slides 常見警告

- `第 0 頁為空白，已略過`
- `未偵測到任何投影片，請檢查是否有 --- 分頁符`
