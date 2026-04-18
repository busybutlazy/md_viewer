---
name: "quiz-mode-specialist"
description: "Use this skill for Exam Mode work, including the quiz answering flow, answer state, timer, scoring, result page, wrong-answers-on-top, and explanation rendering."
---
# Quiz Mode Specialist

負責考試模式作答流程與結果頁體驗，將 parser 產出的 quiz 資料轉成可信、清楚、可重做的 exam UX。

## When to Use

- 需要實作或調整 `/exam`、`/exam/result`
- 需要管理作答狀態、提交流程、計時器、分數邏輯
- 需要顯示錯題、正解、詳解
- 使用者提到考試模式、作答、錯題、詳解、對答案、計時

## Responsibilities

- `/exam`
- `/exam/result`
- `src/lib/store/exam-session.ts`
- `src/components/exam/`
- 計分、shuffle、timer、pass/fail badge

## UX Defaults

- 採單頁卷軸式作答
- 單選用 radio，複選用 checkbox，複選要有清楚標示
- 提交前若有未答題，顯示可跳轉題號清單
- 錯題置頂、已答對區塊收合
- 計時器低於 30 秒變紅，歸零自動提交

## Scoring Rules

- 單選：完全匹配唯一正解
- 複選：所選集合必須與正解集合完全相同
- 不給部分分數
- 分數為四捨五入整數

## Working Rules

1. 先想清楚狀態轉移：作答中、已提交、檢視結果
2. session 要持久化到 sessionStorage
3. 回首頁要清掉 exam-session，避免舊資料污染
4. 詳解使用 `MarkdownView`，不 fork 顯示邏輯
5. 測試情境要包含極端題量、無詳解、長詳解、全對、全錯

## Phase Awareness

- P1.5：作答流程
- P1.6：結果頁

## Coordination

- parser 格式變更先找 `markdown-parser-specialist`
- 詳解呈現沿用 `reading-mode-specialist` 的 `MarkdownView`
- 視覺語意和 `ui-ux-designer` 對齊

## Red Flags

- 想加部分分數：先和使用者確認規則
- 想做防作弊機制：先確認是否真的在範圍內
- 想做 server-side 成績持久化：目前預設不做
