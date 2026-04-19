---
type: quiz
title: JavaScript 與 React 小測
shuffle: true
shuffleOptions: true
passingScore: 70
timeLimit: 420
---

## Q1: 哪一個不是 JavaScript primitive？

- [ ] string
- [ ] number
- [x] array
- [ ] boolean

> 解析: array 屬於 object，不是 primitive。

## Q2: 以下哪些屬於 ES6 引入？（複選）

- [x] `let`
- [x] arrow function
- [ ] `var`
- [x] `Promise`

> 解析: `var` 在 ES6 之前就存在，其餘皆為 ES6 新增。

## Q3: React 中哪個 hook 用來保存 local state？

- [x] `useState`
- [ ] `useEffect`
- [ ] `useContext`
- [ ] `useTransition`

> 解析: `useState` 是函式元件最基本的 local state API。

## Q4: 哪一種條件下 `useEffect` 會在每次 render 後執行？

- [x] 沒有 dependency array
- [ ] dependency array 為 `[]`
- [ ] dependency array 只有 `count`
- [ ] `useEffect` 不會在 render 後執行

> 解析: 沒有 dependency array 時，effect 會在每次 commit 後執行。

## Q5: 關於 sessionStorage，下列哪些描述正確？（複選）

- [x] 重新整理頁面後仍可保留資料
- [ ] 關掉瀏覽器再打開仍永遠保留
- [x] 資料生命週期通常跟當前 tab 相關
- [ ] 可以直接存 function

> 解析: sessionStorage 跟 tab session 綁定，重新整理通常仍在，但不適合存 function。

## Q6: 哪個語法可以建立一個 Promise？

- [ ] `new Async()`
- [x] `new Promise((resolve) => resolve())`
- [ ] `Promise.create()`
- [ ] `await {}`

> 解析: Promise 由 `new Promise(executor)` 建立。

## Q7: React 19 閱讀模式中，哪個元件最適合重用於詳解渲染？

- [ ] `QuestionCard`
- [x] `MarkdownView`
- [ ] `ThemeToggle`
- [ ] `SlideNavigator`

> 解析: 詳解本質仍是 markdown 內容，直接沿用 `MarkdownView` 最合理。

## Q8: 哪個事件最適合用來提醒使用者離開有未存變更的頁面？

- [x] `beforeunload`
- [ ] `mousemove`
- [ ] `DOMContentLoaded`
- [ ] `visibilitychange`

> 解析: `beforeunload` 是瀏覽器離頁前常見的警告機制。

## Q9: 下列哪些是好的 keyboard UX？（複選）

- [x] 可用 Tab 聚焦控制項
- [x] 以 Space 或 Enter 觸發目前聚焦按鈕
- [ ] 必須依賴滑鼠 hover
- [x] 有清楚的 focus-visible 樣式

> 解析: keyboard path 應與滑鼠 path 一樣完整，不能只靠 hover。

## Q10: 對簡報模式來說，哪種方式最適合 phase 1 的 PDF 匯出？

- [ ] 導入重型簡報框架
- [x] `window.print()` 搭配 `@media print`
- [ ] 把每頁轉成 PNG 後再組 PDF
- [ ] 強制使用 Electron 才能匯出

> 解析: phase 1 先用原生列印能力搭配 print stylesheet，成本最低也最穩。
