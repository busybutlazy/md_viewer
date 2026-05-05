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
import { getRouteByDocumentMode } from "@/lib/document-routes";
import { createUploadAdapterFromFile } from "@/lib/fs/upload-adapter";
import { useDocumentStore } from "@/lib/store/document";
import { useExamSessionStore } from "@/lib/store/exam-session";
import { useT } from "@/lib/i18n";

const ACCEPTED_EXTENSIONS = [".md", ".markdown", ".txt"];

export function UploadPanel() {
  const t = useT();
  const clearExamSession = useExamSessionStore((state) => state.clearSession);
  const loadDocumentFromAdapter = useDocumentStore((state) => state.loadDocumentFromAdapter);
  const { pushToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toast = searchParams.get("toast");
    if (toast !== "missing-document") return;
    pushToast({ description: t.upload.toast.notFound.desc, title: t.upload.toast.notFound.title });
    router.replace("/");
  }, [pushToast, router, searchParams, t]);

  const dropzone = useDropzone({
    accept: {
      "text/markdown": ACCEPTED_EXTENSIONS,
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    multiple: false,
    onDropAccepted: async (files) => {
      const [file] = files;
      if (!file) return;
      const adapter = createUploadAdapterFromFile(file);
      clearExamSession();
      const nextMode = await loadDocumentFromAdapter(adapter);
      pushToast({ description: t.upload.toast.success.desc(file.name), title: t.upload.toast.success.title });
      router.push(getRouteByDocumentMode(nextMode));
    },
    onDropRejected: () => {
      pushToast({ description: t.upload.toast.rejected.desc, title: t.upload.toast.rejected.title });
    },
  });

  return (
    <Card className="border-[var(--border-strong)]">
      <CardHeader>
        <CardTitle>{t.upload.title}</CardTitle>
        <CardDescription>
          {t.app.tagline}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...dropzone.getRootProps()}
          className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-strong)] p-6 text-center transition hover:border-[var(--accent)] hover:bg-[var(--surface)] focus-within:border-[var(--accent)]"
        >
          <input {...dropzone.getInputProps()} />
          <p className="text-base font-semibold">
            {dropzone.isDragActive ? t.upload.release : t.upload.drag}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            {t.upload.formats}
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="secondary">{t.upload.chooseFile}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
