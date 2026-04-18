import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ToastProvider } from "@/components/ui/Toast";
import Home from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Home", () => {
  it("renders the project title and design system preview", () => {
    render(
      <ToastProvider>
        <Home />
      </ToastProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Markdown Reader Pro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("P1.1 Design System")).toBeInTheDocument();
    expect(screen.getByText("System Preview")).toBeInTheDocument();
    expect(screen.getByText("Noto Sans TC")).toBeInTheDocument();
    expect(screen.getByText("Inter")).toBeInTheDocument();
    expect(screen.getByText("JetBrains Mono")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument();
  });
});
