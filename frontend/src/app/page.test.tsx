import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the project title and font samples", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Markdown Reader Pro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Noto Sans TC")).toBeInTheDocument();
    expect(screen.getByText("Inter")).toBeInTheDocument();
    expect(screen.getByText("JetBrains Mono")).toBeInTheDocument();
  });
});
