---
title: React 19 閱讀深潛
author: Busybutlazy
date: 2026-04-20
tags:
  - react
  - reading
  - sample
---

# React 19 閱讀深潛

這是一份給閱讀模式正式驗收用的 sample。它不是 lorem ipsum，而是刻意混合長文、表格、圖片、blockquote、task list 與 code block，目的就是讓 typography、TOC 與 progress 真正被壓力測試。

## 為什麼一個 markdown reader 需要閱讀模式

Markdown 本身只是資料格式，不保證閱讀體驗。真正決定可讀性的，是字級、行距、對比、視覺節奏，以及 heading 是否能形成可靠導航。

### 可讀性比功能列表更重要

當文章超過一千字，使用者感受到的不是功能點，而是疲勞。這也是為什麼閱讀模式要先完成：

- 段落間距必須穩
- 表格不能像 spreadsheet 貼片
- code block 要和正文有節奏差
- 圖片要有 caption 與邊界

> 閱讀模式不是首頁的延伸，而是產品最長駐的一個場景。只要長文讀起來累，後面的 explanation 與 preview 都會一起失分。

## Heading、TOC 與深連結

閱讀模式把所有 H1-H6 都補上 id，讓 URL hash 能直接深連結，右側 TOC 也才能穩定 highlight。

### Heading 的 slug 要可預期

如果同名 heading 沒有處理重複 id，第二個節點會覆蓋第一個，TOC 點擊也會飄掉。這個 sample 會故意重複一些語意相近的標題，驗證 slug 是否有穩定遞增。

## 表格與資訊密度

| 項目 | 需求 | 說明 |
| --- | --- | --- |
| TOC | H2/H3 | 右側 sticky 導航 |
| Progress | scroll-based | 隨捲動更新 |
| Code Block | copy + label | 強化掃視與重用 |

## 圖片與 caption

![Workspace desk](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80)

圖片不是裝飾，而是節奏點。當正文密度高時，一張視覺穩定的圖片能當作段落呼吸區。

## 程式碼區塊

```tsx
export function ReaderShell() {
  return (
    <main>
      <article>Readable content wins.</article>
    </main>
  );
}
```

## 任務清單

- [x] 長文排版
- [x] 表格
- [x] 圖片
- [x] code block
- [ ] 全文搜尋

## 收尾

如果這份文章在桌面與手機都能穩定閱讀、TOC 不亂跳、progress 正常、code block 與圖片節奏自然，就代表閱讀模式已經達到 phase 1 的品質基線。
