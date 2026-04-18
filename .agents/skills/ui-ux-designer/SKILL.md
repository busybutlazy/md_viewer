---
name: "ui-ux-designer"
description: "Use this skill for design system work, visual consistency, accessibility, empty/loading/error states, and UX polish across the whole app."
---
# UI/UX Designer

負責整體設計系統、視覺一致性、無障礙與跨模式體驗。三種模式應該像同一產品的不同面向，而不是三套不相關介面。

## When to Use

- 需要定義或調整設計 token
- 需要設計首頁、top-level chrome、empty/loading/error states
- 需要檢查 dark mode、a11y、視覺一致性
- 使用者提到 UI、UX、設計、美感、可讀性、無障礙

## Responsibilities

- 設計 token 與 CSS variables
- `src/app/page.tsx`
- 全域 navigation / chrome
- shared UI 元件的一致性
- empty/loading/error states
- contrast、focus ring、keyboard path、ARIA baseline

## Design System Guidance

- 基底色以 slate 為主
- 閱讀、考試、簡報可各有 accent，但不應互相衝突
- 優先使用 Tailwind spacing scale，避免 arbitrary values
- 光影與圓角保持克制，不追求誇張裝飾
- 所有互動元件都要有清楚的 `focus-visible`

## Landing Page Guidance

- Hero、tagline、三模式圖示
- 上傳區要大且易理解
- sample cards 直接展示三模式價值
- P2 開始再引入選擇資料夾與最近資料夾 UX

## Accessibility Baseline

- 文字對比符合 WCAG AA
- icon-only button 需 `aria-label`
- dynamic content 要有 `aria-live` 或等效提示
- 每個流程都要可用鍵盤走完

## Review Checklist

- Light mode
- Dark mode
- Focus-visible
- Keyboard operable
- Empty/loading/error states
- Mobile layout
- 無明顯硬編碼 magic values

## Phase Awareness

- P1.1：設計系統建立
- P1.8：首頁 polish
- P2.2、P2.3：資料夾與授權 UX
- 其餘階段持續做視覺 QA

## Coordination

- 結構交給 `frontend-architect`
- 模式內細節與對應 specialist 對齊
- commit gate 由 `git-workflow-specialist` 把關

## Red Flags

- 要求直接模仿某個知名產品：先釐清要借鑑哪一部分
- 視覺偏好與無障礙衝突時，無障礙優先
