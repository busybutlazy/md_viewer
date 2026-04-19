"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { ToastDemoButton } from "@/components/ui/Toast";

export function HomeShowcase() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <Badge tone="accent">Button</Badge>
          <CardTitle>Primary actions stay obvious</CardTitle>
          <CardDescription>
            The default CTA is warm and assertive. Secondary actions stay visible
            without competing with the main path.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Upload Markdown</Button>
          <Button variant="secondary">Open Sample</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Badge tone="outline">Dialog</Badge>
          <CardTitle>Confirmation copy has room to breathe</CardTitle>
          <CardDescription>
            Dialogs should feel calm and readable instead of abrupt system
            overlays.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog
            description="這裡之後會用在未作答警告、刪除確認與重要模式切換。"
            title="Preview Dialog"
            triggerLabel="Open Dialog"
          >
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              The same layout can hold danger actions, keyboard hints, or parser
              warnings without inventing a separate visual language.
            </p>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Badge tone="default">Toast</Badge>
          <CardTitle>Status feedback stays lightweight</CardTitle>
          <CardDescription>
            Toasts are designed for upload success, invalid file type, and
            route-guard feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToastDemoButton
            description="Theme, shell, and base UI tokens are wired and ready for mode-specific work."
            title="P1.1 preview ready"
          />
        </CardContent>
      </Card>
    </section>
  );
}
