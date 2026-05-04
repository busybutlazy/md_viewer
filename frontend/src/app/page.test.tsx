import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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
  it("renders the product hero, upload flow, and sample section", async () => {
    render(
      <ToastProvider>
        <Home />
      </ToastProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Markdown Reader Pro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sample Files")).toBeInTheDocument();
    expect(screen.getByText("React 19 閱讀深潛")).toBeInTheDocument();
    expect(screen.getByText("JavaScript 與 React 小測")).toBeInTheDocument();
    expect(screen.getByText("Product Narrative Deck")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Choose Folder" }),
    ).not.toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText("想要瀏覽整個資料夾？請使用 Chrome 或 Edge。"),
      ).toBeInTheDocument();
    });
  });
});
