"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import type { DocumentMode } from "@/lib/parsers/types";
import { useDocumentStore } from "@/lib/store/document";

const ACCEPTED_EXTENSIONS = [".md", ".markdown", ".txt"];

function getRouteByMode(mode: DocumentMode): string {
  if (mode === "quiz") {
    return "/exam";
  }

  if (mode === "slides") {
    return "/slides";
  }

  return "/read";
}

export function UploadPanel() {
  const loadDocument = useDocumentStore((state) => state.loadDocument);
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

      const markdown = await file.text();
      const nextMode = loadDocument({ fileName: file.name, markdown });

      pushToast({
        description: `已解析 ${file.name}，即將帶你進入對應模式。`,
        title: "Upload successful",
      });
      router.push(getRouteByMode(nextMode));
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
        <Badge className="w-fit" tone="accent">
          P1.3 Upload Flow
        </Badge>
        <CardTitle>Drop a markdown file to enter the right mode</CardTitle>
        <CardDescription>
          The document is parsed once, stored in sessionStorage, then routed to
          Reading, Exam, or Slides based on frontmatter.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
