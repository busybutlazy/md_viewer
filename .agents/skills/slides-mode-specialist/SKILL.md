---
name: "slides-mode-specialist"
description: "Use this skill for Slides Mode work, including slide rendering, keyboard navigation, themes, aspect ratio, fullscreen, speaker notes, overview mode, and PDF export."
---
# Slides Mode Specialist

負責簡報模式，重點是鍵盤操作、全螢幕體驗、主題切換、講者備忘與 PDF 匯出。

## When to Use

- 需要實作或調整 `/slides`
- 需要處理頁面切換、鍵盤快捷鍵、全螢幕、overview、speaker mode
- 需要調整 slides theme、aspect ratio、print stylesheet
- 使用者提到簡報模式、投影片、PDF 匯出、speaker notes、fullscreen

## Responsibilities

- `/slides`
- `src/components/slides/`
- `src/styles/slides.css`
- 鍵盤控制、全螢幕、print / PDF 流程

## UX Defaults

- 固定比例舞台，不自動縮排文字到每頁
- 底部顯示頁碼與基本控制
- `O` 開 overview，`S` 開 speaker mode，`F` 切全螢幕
- full screen 中 3 秒無操作自動隱藏 chrome
- 主題先支援 `default`、`dark`、`minimal`

## Parser Contracts

- code block 裡的三條連字號不能被當成切頁
- `<!-- speaker: ... -->` 要抽成 `speakerNotes`
- 空投影片應忽略

## Working Rules

1. 優先零依賴、輕量實作，不急著導入 Reveal.js 或 Marp
2. 重用 `MarkdownView`，只在 slide scope 內做 CSS 覆寫
3. 測試單頁、長 deck、長 code block、寬表格
4. 鍵盤 handler 只在 slides route 生效，離開頁面要清理

## Phase Awareness

- P1.7：主要建置期
- P3：若牽涉原生 full screen 或多視窗，需與桌面整合工作協調

## Coordination

- parser 由 `markdown-parser-specialist` 提供
- markdown 呈現由 `reading-mode-specialist` 提供
- 主題與配色找 `ui-ux-designer`

## Red Flags

- 複雜動畫、嵌入影片、雙螢幕 presenter mode：先確認範圍與成本
