"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "@/components/ui/ThemeProvider";

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
}

export function EditorPane({ value, onChange }: EditorPaneProps) {
  const { resolvedTheme } = useTheme();

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[markdown()]}
      theme={resolvedTheme === "dark" ? githubDark : githubLight}
      className="h-full text-sm"
      height="100%"
      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: false,
        highlightActiveLine: true,
        highlightSelectionMatches: false,
      }}
    />
  );
}
