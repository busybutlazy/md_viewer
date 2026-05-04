export interface Template {
  description: string;
  fileName: string;
  label: string;
  markdown: string;
}

export const TEMPLATES: Template[] = [
  {
    description: "一行標題，自由發揮",
    fileName: "untitled.md",
    label: "空白",
    markdown: "# \n",
  },
  {
    description: "含 frontmatter 的長文閱讀骨架",
    fileName: "untitled-reading.md",
    label: "閱讀",
    markdown: `---
type: reading
title: 未命名文件
author: ""
date: ""
tags: []
---

# 未命名文件

在這裡開始寫作。

## 第一節

段落內容。

## 第二節

段落內容。
`,
  },
  {
    description: "含一題範例的考試骨架",
    fileName: "untitled-quiz.md",
    label: "考試",
    markdown: `---
type: quiz
title: 未命名測驗
timeLimit: 0
shuffle: false
shuffleOptions: false
---

## Q1
type: single
answer: C

題目文字

A. 選項 A
B. 選項 B
C. 正確答案
D. 選項 D

> 解析：說明為什麼這是正確答案。
`,
  },
  {
    description: "含三頁範例的簡報骨架",
    fileName: "untitled-slides.md",
    label: "簡報",
    markdown: `---
type: slides
title: 未命名簡報
theme: default
aspectRatio: "16:9"
---

# 第一張投影片

在這裡加入內容。

---

# 第二張投影片

更多內容。

---

# 第三張投影片

結語。
`,
  },
];
