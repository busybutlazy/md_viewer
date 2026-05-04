"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getRouteByDocumentMode } from "@/components/home/UploadPanel";
import { createUploadAdapterFromFile } from "@/lib/fs/upload-adapter";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

interface UploadTriggerButtonProps {
  variant?: "primary" | "secondary" | "ghost";
}

export function UploadTriggerButton({ variant = "secondary" }: UploadTriggerButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { pushToast } = useToast();
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const clearExamSession = useExamSessionStore((state) => state.clearSession);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const adapter = createUploadAdapterFromFile(file);
    clearExamSession();
    const nextMode = await loadDocumentFromAdapter(adapter);

    pushToast({
      description: `已解析 ${file.name}，即將帶你進入對應模式。`,
      title: "Upload successful",
    });
    router.push(getRouteByDocumentMode(nextMode));
    e.target.value = "";
  }

  return (
    <>
      <input
        accept=".md,.markdown,.txt"
        className="hidden"
        onChange={(e) => void handleChange(e)}
        ref={inputRef}
        type="file"
      />
      <Button onClick={() => inputRef.current?.click()} variant={variant}>
        Try it
      </Button>
    </>
  );
}
