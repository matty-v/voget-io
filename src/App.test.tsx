import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders the homepage hierarchy and current career beat", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "Leading teams and building production software.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Kubernetes-native infrastructure for persistent AI agents.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Gravitee")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.getByText("→ Ivanti")).toBeInTheDocument();
    expect(screen.getByText("→ SmartBear")).toBeInTheDocument();
    expect(screen.getAllByText("→ Gravitee")).toHaveLength(1);
  });

  it("renders the future writing entry without a misleading link", () => {
    render(<App />);

    expect(screen.getByText("Writing").closest("a")).toBeNull();
    expect(screen.getByText("COMING SOON")).toBeInTheDocument();
  });

  it("runs a fixed showcase-agent action", async () => {
    render(<App />);

    expect(screen.getByText("Harness: Codex")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Agent features/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Kyber architecture/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cluster status/ }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Tell me a joke/ }));
    expect(screen.getByText("Working…")).toBeInTheDocument();
    expect(
      await screen.findByText(/Kubernetes pod go to therapy/),
    ).toBeInTheDocument();
  });

  it("closes the mobile menu with Escape", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });
});
