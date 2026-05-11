import type { zh } from "./zh";

export const en: typeof zh = {
  app: {
    title: "Markdown Reader Pro",
    tagline: "Read · Exam · Slides",
    description: "Upload a markdown file and get automatically routed to Reading, Exam, or Slides based on frontmatter.",
    phase: "Markdown Reader Pro · Phase 1",
  },
  nav: {
    read: "Read",
    exam: "Exam",
    slides: "Slides",
    edit: "Edit",
  },
  home: {
    newDoc: {
      title: "New Document",
      desc: "Start from a template and open in the editor.",
    },
    samples: {
      label: "Sample Files",
      heading: "Official samples for all three modes",
    },
  },
  upload: {
    title: "Upload a Markdown File",
    drag: "Drag & drop a .md file here",
    release: "Release to upload",
    formats: ".md · .markdown · .txt",
    chooseFile: "Choose File",
    toast: {
      notFound: {
        title: "Document not found",
        desc: "No document in store. Redirected to home — please upload or load a markdown file.",
      },
      success: {
        title: "Upload successful",
        desc: (name: string) => `Parsed ${name}, routing to the matching mode.`,
      },
      rejected: {
        title: "Unsupported file type",
        desc: "Only .md, .markdown, and .txt files are accepted.",
      },
    },
  },
  sidebar: {
    chooseFolder: "Choose Folder",
    reauthorize: "Re-authorize",
    chooseDifferent: "Choose different",
    expand: "Expand sidebar",
    collapse: "Collapse sidebar",
    files: "Files",
    folder: "Folder",
    fileCount: (n: number) => `${n} markdown ${n === 1 ? "file" : "files"}`,
    new: "New",
    refresh: "Refresh",
    search: "Search files",
    noResults: "No markdown files match the current search.",
    unmount: {
      label: "⏏ Unmount folder",
      confirm: "Unmount folder?",
      yes: "Confirm",
      no: "Cancel",
    },
    delete: {
      label: (name: string) => `Delete ${name}`,
      button: "Del",
      confirm: "Delete?",
      cancel: "Cancel",
    },
    toast: {
      notOpened: { title: "Folder not opened", desc: "Folder read/write permission was not granted." },
      authFailed: { title: "Authorization failed", desc: "Authorization failed — please choose the folder again." },
      deleted: {
        title: "File deleted",
        desc: (path: string) => `${path} was deleted.`,
      },
    },
    newFile: {
      title: "New markdown file",
      subtitle: "Create at the folder root and open it in the editor.",
      fileNameLabel: "File name",
      cancel: "Cancel",
      create: "Create",
    },
    close: "Close",
  },
  folderStatus: {
    label: (name: string) => `Folder: ${name}`,
    switch: "Switch folder",
    clear: "Clear permission",
    toast: {
      switched: {
        title: "Folder switched",
        desc: (name: string) => `Switched to ${name}.`,
      },
      cleared: {
        title: "Folder permission cleared",
        desc: "Folder permission cleared. You'll need to choose the folder again next time.",
      },
    },
  },
  newDocDialog: {
    button: "+ New .md",
    title: "New Markdown File",
    subtitle: "Choose a template and open in the editor.",
    close: "Close",
  },
  sampleCards: {
    tryIt: "Try it",
    tryItLoaded: "Try sample",
    template: "Template",
    items: [
      {
        badge: "Reading",
        modeLabel: "Reading mode",
        title: "React 19 Deep Dive",
        description: "Full reading demo with long-form text, images, tables and code blocks.",
        preview: "1500+ word technical article, ideal for verifying TOC, progress and typography.",
        fileName: "reading-sample.md",
      },
      {
        badge: "Exam",
        modeLabel: "Exam mode",
        title: "JavaScript & React Quiz",
        description: "10 questions with single and multiple choice, plus various explanation formats.",
        preview: "Covers single-select, multi-select, long explanations and markdown.",
        fileName: "exam-sample.md",
      },
      {
        badge: "Slides",
        modeLabel: "Slides mode",
        title: "Product Narrative Deck",
        description: "12-slide deck verifying theme, speaker notes and print.",
        preview: "Showcases default / dark / minimal themes and code block pages.",
        fileName: "slides-sample.md",
      },
    ],
  },
  uploadPrompt: {
    label: "No document loaded",
    title: "Upload a Markdown File",
    desc: "Drop a .md file and the app routes you to Reading, Exam, or Slides based on frontmatter.",
    drag: "Drag & drop your file here",
    release: "Release to upload",
    accepts: "Accepts .md · .markdown · .txt",
    chooseFile: "Choose File",
    orSample: "or try a sample",
    toast: {
      rejected: { title: "Unsupported file type", desc: "Only .md, .markdown, and .txt files are accepted." },
    },
  },
  warnings: {
    label: "Warnings",
    title: "Parser emitted non-fatal warnings.",
  },
  uploadTrigger: { label: "Switch file" },
  read: {
    badge: "Reading Mode",
    untitled: "Untitled Reading Document",
    file: "File:",
    author: "Author:",
    date: "Date:",
    edit: "Edit",
  },
  slides: {
    badge: "Slides Mode",
    noSlides: "No slides to display. Make sure the markdown contains valid slide separators.",
  },
  exam: {
    badge: "Exam Mode",
    progress: (unanswered: number, answered: number) =>
      `${unanswered} unanswered, ${answered} answered.`,
    submit: "Submit Exam",
    timer: { label: "Timer", noLimit: "No limit" },
    question: {
      single: "Single choice",
      multi: "Multiple choice",
      selected: (n: number) => `${n} selected`,
    },
    submitDialog: {
      title: "Submit Exam",
      allAnswered: "All questions answered. Submitting will take you to the results page.",
      hasUnanswered: "The following questions are unanswered. You can review them or submit now.",
      unansweredLabel: "Unanswered questions",
      close: "Close",
      continueEditing: "Continue",
      submitNow: "Submit Now",
    },
  },
  edit: {
    save: "Save",
    download: "Download .md",
    saveCopy: "Save copy",
    saving: "Saving...",
    tab: { editor: "Editor", preview: "Preview" },
    toast: {
      saved: {
        title: "Saved",
        desc: (path: string) =>
          `${path} written back to disk. Any concurrent external edits will be overwritten.`,
      },
      saveFailed: {
        title: "Save failed",
        authExpired: "Folder permission expired. Please choose the folder again before saving.",
        unknown: "An unknown error occurred while writing the file.",
      },
    },
  },
  theme: {
    light: "Light",
    system: "System",
    dark: "Dark",
    badge: (t: string) => `Current theme ${t}`,
    loading: "Theme loading",
  },
  lang: { zh: "繁中", en: "EN" },
  templates: {
    "untitled.md": { label: "Blank", description: "One heading, free to write" },
    "untitled-reading.md": { label: "Reading", description: "Long-form reading skeleton with frontmatter" },
    "untitled-quiz.md": { label: "Exam", description: "Quiz skeleton with one sample question" },
    "untitled-slides.md": { label: "Slides", description: "Presentation skeleton with three slides" },
  } as Record<string, { label: string; description: string }>,
};
