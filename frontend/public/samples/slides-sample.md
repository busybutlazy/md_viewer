---
type: slides
title: Product Narrative Deck
theme: minimal
aspectRatio: "16:9"
---

# Markdown Reader Pro

從單一 markdown 檔案，直接切換成閱讀、考試與簡報模式。

<!-- speaker: 開場時先說明這個產品不是編輯器，而是閱讀與展示工作流。 -->

---

## 問題背景

- 文章、題庫、簡報常常其實都來自 markdown
- 但大多數工具只優化其中一種使用情境
- 結果是同一份內容被迫複製到多套系統

---

## 核心策略

1. Parse once
2. 以 frontmatter 決定 mode
3. 所有 mode 共用同一份 document store

<!-- speaker: 強調 parser、store、route 三者的關係。 -->

---

## Reading Mode

- 長文排版
- Table of Contents
- Reading progress
- Code block copy

---

## Exam Mode

- 單選 / 複選
- sessionStorage 持久化
- timer auto-submit
- 錯題置頂與詳解

---

## Slides Mode

- Keyboard navigation
- Overview
- Speaker notes
- Print export

---

## Parser Edge Case

```yaml
---
server:
  port: 8080
---
```

這頁的 `---` 在 code fence 內，不應該被視為分頁符。

<!-- speaker: 這是 slides parser 最容易踩坑的案例之一。 -->

---

## Theme Direction

- `default`：偏暖、品牌感較強
- `dark`：適合投影與低光場景
- `minimal`：乾淨、像 keynote handout

---

## Speaker View

講者模式需要：

- 當前頁備忘
- 下一頁預覽
- 不干擾主舞台

---

## Print Export

透過 `window.print()` 與 `@media print`：

- 每頁一張 slide
- 不印 chrome
- 維持固定 aspect ratio

---

## 未來階段

- Phase 2: 資料夾授權與檔案樹
- Phase 3: Electron 桌面封裝

---

## Thank You

同一份 markdown，支撐更多實際使用情境。
