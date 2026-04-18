"use client";

import { WarningBanner } from "@/components/document/WarningBanner";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useRequireDocument } from "@/components/document/ModeGuard";
import { useDocumentStore } from "@/lib/store/document";

export default function ReadPage() {
  const { mode, parsed } = useRequireDocument();
  const warnings = useDocumentStore((state) => state.warnings);
  const fileName = useDocumentStore((state) => state.fileName);

  if (mode !== "reading" || !parsed || !("content" in parsed)) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <WarningBanner warnings={warnings} />
        <Card>
          <CardHeader>
            <Badge className="w-fit" tone="accent">
              Reading Mode
            </Badge>
            <CardTitle>{parsed.meta.title ?? fileName ?? "Untitled Reading Document"}</CardTitle>
            <CardDescription>
              P1.3 先驗證 document store、守衛與導頁。完整閱讀排版會在 P1.4 實作。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              Current file: {fileName ?? "Unknown"}
            </p>
            <pre className="overflow-auto rounded-3xl bg-[var(--surface-strong)] p-5 text-sm leading-7 text-[var(--muted-foreground)]">
              {parsed.content}
            </pre>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
