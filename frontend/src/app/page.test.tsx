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
  it("renders the product hero, upload flow, and sample section", () => {
    render(
      <ToastProvider>
        <Home />
      </ToastProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Markdown Reader Pro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Phase 1 Web App")).toBeInTheDocument();
    expect(screen.getByText("Launch Fast")).toBeInTheDocument();
    expect(screen.getByText("Sample Files")).toBeInTheDocument();
    expect(screen.getByText("React 19 閱讀深潛")).toBeInTheDocument();
    expect(screen.getByText("JavaScript 與 React 小測")).toBeInTheDocument();
    expect(screen.getByText("Product Narrative Deck")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument();
  });
});
