"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { FolderAccessPanel } from "@/components/home/FolderAccessPanel";
import { getRouteByDocumentMode } from "@/lib/document-routes";
import { createUploadAdapterFromFile } from "@/lib/fs/upload-adapter";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";

const ACCEPTED_EXTENSIONS = [".md", ".markdown", ".txt"];

export function UploadPanel() {
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const { pushToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toast = searchParams.get("toast");

    if (toast !== "missing-document") {
      return;
    }

    pushToast({
      description: "目前 store 為空，已帶你回首頁。請先上傳或載入一份 markdown。",
      title: "Document not found",
    });
    router.replace("/");
  }, [pushToast, router, searchParams]);

  const dropzone = useDropzone({
    accept: {
      "text/markdown": ACCEPTED_EXTENSIONS,
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    multiple: false,
    onDropAccepted: async (files) => {
      const [file] = files;

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
    },
    onDropRejected: () => {
      pushToast({
        description: "只接受 .md、.markdown、.txt 檔案。",
        title: "Unsupported file type",
      });
    },
  });

  return (
    <Card className="border-[var(--border-strong)]">
      <CardHeader>
        <CardTitle>Upload a markdown file</CardTitle>
        <CardDescription>
          Parsed once and routed to Reading, Exam, or Slides based on
          frontmatter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FolderAccessPanel />
        <div
          {...dropzone.getRootProps()}
          className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-strong)] p-8 text-center transition hover:border-[var(--accent)] hover:bg-[var(--surface)] focus-within:border-[var(--accent)]"
        >
          <input {...dropzone.getInputProps()} />
          <p className="text-lg font-semibold">
            {dropzone.isDragActive
              ? "Release to upload the file"
              : "Drag and drop a markdown file here"}
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Accepts .md, .markdown, and .txt. Invalid file types trigger a toast.
          </p>
          <div className="mt-5 flex justify-center">
            <Button variant="secondary">Choose File</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
