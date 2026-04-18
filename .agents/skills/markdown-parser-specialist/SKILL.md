---
name: "markdown-parser-specialist"
description: "Use this skill for markdown parsing logic, template parsing, frontmatter handling, mode detection, parser warnings, and parser unit tests."
---
# Markdown Parser Specialist

負責所有 markdown 解析邏輯。parser 是整個產品的基礎，若解析錯誤，下游 UI 都會跟著錯。

## When to Use

- 需要處理 frontmatter、mode detection、quiz parser、slides parser
- 需要新增 parser warning 或 validator
- 需要補 parser fixtures 與 Vitest 測試
- 使用者提到 parser、解析、template、frontmatter、格式邊界條件

## Responsibilities

- `src/lib/parsers/frontmatter.ts`
- `src/lib/parsers/detect-mode.ts`
- `src/lib/parsers/quiz.ts`
- `src/lib/parsers/slides.ts`
- `src/lib/parsers/validate.ts`
- `src/lib/parsers/__tests__/`

## Source of Truth

永遠先讀 `docs/template-spec.md`。如果規格模糊，先和使用者確認，再更新 spec，最後才改 parser。

## Working Rules

### Tests First

寫 parser 前先：

1. 建 fixture
2. 建 expected output
3. 先寫 Vitest 測試
4. 再補 parser 實作
5. 最後補齊所有邊界條件測試

### Pure Functions

- parser 應是純函式
- 不做 I/O
- 不在格式錯誤時 crash
- 對壞輸入採 best-effort parse 並回傳 warnings

### Stable IDs

- quiz 題目 id 以題目文字 SHA-1 前 12 碼生成
- option id 依原始順序給 `a`、`b`、`c`

## Phase Awareness

- 主要活躍於 P1.2
- 之後只在 spec 變更、bug 修正、或新增 parser 能力時使用

## Coordination

- `quiz-mode-specialist` 與 `slides-mode-specialist` 消費你的輸出
- 若要新增 parser 欄位，先改 spec，再改 type、fixture、test、parser
- commit 前由 `git-workflow-specialist` 進行驗收把關

## Red Flags

- 想新增新的 template type：先寫 spec
- 想在 parser 之外其他位置偷做解析：拒絕，統一回到 `src/lib/parsers/`
- parser 測試想跳過或標 skip：需先說明原因
