import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    vi.unstubAllGlobals();
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
        name: "Kyber: Kubernetes-native infrastructure for persistent AI agents.",
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
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        command: "joke",
        response: "Why did the Kubernetes pod go to therapy? Too many unresolved dependencies.",
        live: true,
        harness: "Codex",
      }),
    }));
    render(<App />);

    expect(screen.getByText("AI agent on Kyber")).toBeInTheDocument();
    expect(
      screen.getByText(/Hi, I’m Glyph. Choose one of my skills/),
    ).toBeInTheDocument();
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
    expect(screen.getByRole("status", { name: "Glyph is working" })).toBeInTheDocument();
    expect(screen.getByText("Tell me a joke", { selector: "p" })).toBeInTheDocument();
    expect(
      await screen.findByText(/Kubernetes pod go to therapy/),
    ).toBeInTheDocument();
  });

  it("keeps the six most recent chat messages", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (_url, init: RequestInit) => {
        const { command } = JSON.parse(String(init.body));
        return {
          ok: true,
          json: async () => ({
            command,
            response: `${command} response`,
            live: true,
          }),
        };
      }),
    );
    const { container } = render(<App />);

    for (const label of [
      "Tell me a joke",
      "Agent features",
      "Kyber architecture",
      "Cluster status",
    ]) {
      fireEvent.click(screen.getByRole("button", { name: label }));
      await screen.findByText(`${label === "Tell me a joke" ? "joke" : label === "Agent features" ? "features" : label === "Kyber architecture" ? "architecture" : "cluster-status"} response`);
    }

    expect(container.querySelectorAll(".chat-message")).toHaveLength(6);
    expect(screen.queryByText("Tell me a joke", { selector: "p" })).not.toBeInTheDocument();
    expect(screen.getByText("Cluster status", { selector: "p" })).toBeInTheDocument();
  });

  it("renders Glyph responses as safe GitHub-flavored Markdown", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          command: "features",
          response: "| Field | Value |\n| --- | --- |\n| Runtime | **Codex** |\n\n<script>alert('no')</script>",
          live: true,
        }),
      }),
    );
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Agent features" }));
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Codex")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
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
