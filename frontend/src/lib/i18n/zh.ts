export const zh = {
  app: {
    title: "Markdown Reader Pro",
    tagline: "閱讀 · 考試 · 簡報",
    description: "上傳一份 markdown，依 frontmatter 自動切換成閱讀、考試或簡報模式。",
    phase: "Markdown Reader Pro · Phase 1",
  },
  nav: {
    read: "閱讀",
    exam: "考試",
    slides: "簡報",
    edit: "編輯",
  },
  home: {
    newDoc: {
      title: "新建文件",
      desc: "從範本建立，進入編輯器。",
    },
    samples: {
      label: "範例檔案",
      heading: "三種模式的正式範例",
    },
  },
  upload: {
    title: "上傳 Markdown 文件",
    drag: "拖曳 .md 檔到這裡",
    release: "放開以上傳",
    formats: ".md · .markdown · .txt",
    chooseFile: "選擇檔案",
    toast: {
      notFound: {
        title: "找不到文件",
        desc: "目前 store 為空，已帶你回首頁。請先上傳或載入一份 markdown。",
      },
      success: {
        title: "上傳成功",
        desc: (name: string) => `已解析 ${name}，即將帶你進入對應模式。`,
      },
      rejected: {
        title: "不支援的檔案格式",
        desc: "只接受 .md、.markdown、.txt 檔案。",
      },
    },
  },
  sidebar: {
    chooseFolder: "選擇資料夾",
    reauthorize: "重新授權",
    chooseDifferent: "選其他資料夾",
    expand: "展開側欄",
    collapse: "收合側欄",
    files: "檔案",
    folder: "資料夾",
    fileCount: (n: number) => `${n} 個 markdown 檔案`,
    new: "新增",
    refresh: "重新整理",
    search: "搜尋檔案",
    noResults: "沒有符合搜尋的 markdown 檔案。",
    unmount: {
      label: "⏏ 卸載資料夾",
      confirm: "確定卸載？",
      yes: "確認",
      no: "取消",
    },
    delete: {
      label: (name: string) => `刪除 ${name}`,
      button: "刪",
      confirm: "確定刪除？",
      cancel: "取消",
    },
    toast: {
      notOpened: { title: "未開啟資料夾", desc: "未取得資料夾讀寫授權。" },
      authFailed: { title: "授權失敗", desc: "授權失敗，請重新選擇資料夾。" },
      deleted: {
        title: "檔案已刪除",
        desc: (path: string) => `${path} 已刪除。`,
      },
    },
    newFile: {
      title: "新增 Markdown 檔案",
      subtitle: "在資料夾根目錄建立並開啟編輯器。",
      fileNameLabel: "檔案名稱",
      cancel: "取消",
      create: "建立",
    },
    close: "關閉",
  },
  folderStatus: {
    label: (name: string) => `資料夾：${name}`,
    switch: "切換資料夾",
    clear: "清除授權",
    toast: {
      switched: {
        title: "資料夾已切換",
        desc: (name: string) => `已切換到 ${name}。`,
      },
      cleared: {
        title: "資料夾授權已清除",
        desc: "資料夾授權已清除；下次使用需要重新選擇資料夾。",
      },
    },
  },
  newDocDialog: {
    button: "+ 新增 .md",
    title: "新建 Markdown 檔",
    subtitle: "選擇範本，直接進入編輯器。",
    close: "關閉",
  },
  sampleCards: {
    tryIt: "試試看",
    tryItLoaded: "換個範例",
    template: "範本",
    items: [
      {
        badge: "閱讀",
        modeLabel: "閱讀模式",
        title: "React 19 閱讀深潛",
        description: "長文排版、圖片、表格與 code block 的完整閱讀示範。",
        preview: "1500+ 字技術文章，適合驗證 TOC、progress 與 typography。",
        fileName: "reading-sample.md",
      },
      {
        badge: "考試",
        modeLabel: "考試模式",
        title: "JavaScript 與 React 小測",
        description: "10 題選擇題，含複選與多種詳解格式。",
        preview: "涵蓋單選、複選、長詳解與 Markdown explanation。",
        fileName: "exam-sample.md",
      },
      {
        badge: "簡報",
        modeLabel: "簡報模式",
        title: "Product Narrative Deck",
        description: "12 頁簡報，驗證 theme、speaker notes 與 print deck。",
        preview: "展示 default / dark / minimal 風格與 code block 分頁。",
        fileName: "slides-sample.md",
      },
    ],
  },
  uploadPrompt: {
    label: "尚未載入文件",
    title: "上傳 Markdown 文件",
    desc: "放入 .md 檔，系統依 frontmatter 自動切換至閱讀、考試或簡報模式。",
    drag: "拖曳檔案到這裡",
    release: "放開以上傳",
    accepts: "接受 .md · .markdown · .txt",
    chooseFile: "選擇檔案",
    orSample: "或試試範例",
    toast: {
      rejected: { title: "不支援的檔案格式", desc: "只接受 .md、.markdown、.txt 檔案。" },
    },
  },
  warnings: {
    label: "警告",
    title: "解析器發出非致命警告。",
  },
  uploadTrigger: { label: "切換檔案" },
  read: {
    badge: "閱讀模式",
    untitled: "未命名文件",
    file: "檔案：",
    author: "作者：",
    date: "日期：",
    edit: "編輯",
  },
  slides: {
    badge: "簡報模式",
    noSlides: "目前沒有可顯示的投影片。請確認 markdown 內容包含有效分頁。",
  },
  exam: {
    badge: "考試模式",
    progress: (unanswered: number, answered: number) =>
      `未作答 ${unanswered} 題，已作答 ${answered} 題。`,
    submit: "提交考試",
    timer: { label: "計時", noLimit: "無限制" },
    question: {
      single: "單選題",
      multi: "複選題",
      selected: (n: number) => `已選 ${n}`,
    },
    submitDialog: {
      title: "提交考試",
      allAnswered: "所有題目都已作答，提交後會直接進入結果頁。",
      hasUnanswered: "以下題目尚未作答。你可以先跳轉檢查，也可以直接提交。",
      unansweredLabel: "未作答題號",
      close: "關閉",
      continueEditing: "繼續作答",
      submitNow: "立即提交",
    },
  },
  edit: {
    save: "儲存",
    download: "下載 .md",
    saveCopy: "另存副本",
    saving: "儲存中⋯",
    tab: { editor: "編輯器", preview: "預覽" },
    toast: {
      saved: {
        title: "已儲存",
        desc: (path: string) =>
          `${path} 已寫回原檔。若外部編輯器同時修改，這次儲存會以目前編輯器內容覆蓋。`,
      },
      saveFailed: {
        title: "儲存失敗",
        authExpired: "資料夾授權已失效，請重新選擇資料夾後再儲存。",
        unknown: "寫入檔案時發生未知錯誤。",
      },
    },
  },
  theme: {
    light: "淺色",
    system: "系統",
    dark: "深色",
    badge: (t: string) => `目前佈景主題 ${t}`,
    loading: "主題載入中",
  },
  lang: { zh: "繁中", en: "EN" },
  templates: {
    "untitled.md": { label: "空白", description: "一行標題，自由發揮" },
    "untitled-reading.md": { label: "閱讀", description: "含 frontmatter 的長文閱讀骨架" },
    "untitled-quiz.md": { label: "考試", description: "含一題範例的考試骨架" },
    "untitled-slides.md": { label: "簡報", description: "含三頁範例的簡報骨架" },
  } as Record<string, { label: string; description: string }>,
};
