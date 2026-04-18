---
title: React 19 閱讀模式深潛
author: Busybutlazy
date: 2026-04-19
tags:
  - react
  - frontend
  - reading
---

# React 19 閱讀模式深潛

這份 sample 用來驗證閱讀模式在長文、表格、圖片、清單、blockquote 與程式碼區塊下的排版節奏。內容故意偏長，因為短文不容易暴露 TOC、reading progress 與 sticky layout 的問題。

## 為什麼閱讀模式需要獨立設計

不是每一個 markdown viewer 都需要像寫作工具那樣複雜，但只要內容超過一千字，字級、行高、段落間距與邊欄層次很快就會決定可讀性。這個專案的 reading mode 必須先把「讀起來舒服」這件事做好，後面的 exam explanation 和 editor preview 才有穩定基底。

> 解析：閱讀模式不是首頁的延伸，而是產品最常駐的一個工作面。只要 typography 鬆緊失衡，使用者會立刻感覺到累。

### 目標一：讓 heading 成為可靠導航

H2 與 H3 需要穩定生成 id，才能支撐：

- 右側 TOC 點擊跳轉
- 直接分享 `#hash` 深連結
- 長文捲動時的當前段落高亮

### 目標二：code block 必須有獨立節奏

程式碼區塊不只是把字換成 monospace。它還需要：

1. 語言標籤，方便掃視
2. copy 動作，降低重複操作
3. 與正文足夠分離，但不至於像另一個 app

```tsx
export function ReadingMode() {
  return (
    <article>
      <h1>Readable, stable, calm.</h1>
      <p>Typography should carry the product.</p>
    </article>
  );
}
```

## 表格、圖片與引用也要有明確系統

有些 markdown viewer 只把表格硬塞進 overflow 區塊，但沒有處理表頭、邊界與間距，閱讀時會像一塊被貼上去的 spreadsheet。這裡需要更安定的節奏。

| 項目 | 目標 | 狀態 |
| --- | --- | --- |
| TOC | H2/H3 自動掃描 | Ready |
| Progress | 依捲動更新 | Ready |
| Code Block | Copy + language label | Ready |

![Warm reading desk](https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=80)

### 圖片 caption 的角色

圖片下方的 caption 不只是補註，它也會成為閱讀節奏的一部分。如果圖片直接插入沒有邊界和說明，長文很容易斷節奏。

## 任務清單與 HTML passthrough

- [x] 支援 GFM task list
- [x] 支援 table
- [x] 支援 fenced code block
- [ ] 在 P1.4 之外加入全文搜尋

可以接受一些內嵌 HTML，例如 <mark>重點標記</mark> 或簡單的資訊卡，但目前仍以本地檔為主，不去做過度防禦。

## 手機版策略

手機版不應該把 TOC 永遠固定在側邊，那會直接擋到內容。因此更合理的方式是：

1. 內容優先呈現
2. 以浮動按鈕開關 TOC
3. 關閉後不殘留遮罩或卡住捲動

### 小結

閱讀模式完成後，這套 `MarkdownView` 就能在後續的 exam explanation、slides speaker note preview 與 editor preview 中重用。
