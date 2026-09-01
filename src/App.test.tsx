import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    parse: vi.fn().mockResolvedValue(true),
    render: vi.fn().mockResolvedValue({ svg: "<svg><text>Kyber control plane</text></svg>" }),
  },
}));

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
      screen.getByText("Hi, I'm Glyph. Select an option below to learn more about myself and Kyber."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Tell me a little about yourself/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /What are some features of Kyber/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Describe Kyber's architecture/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /How do I get started with Kyber/ }).querySelector("strong"),
    ).toHaveTextContent("How do I get started with Kyber?");
    expect(
      screen.getByRole("button", { name: /Get in touch with Matt/ }),
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
      "Tell me a little about yourself",
      "What are some features of Kyber?",
      "Describe Kyber's architecture",
      "How do I get started with Kyber?",
      "Get in touch with Matt",
      "Tell me a joke",
    ]) {
      fireEvent.click(screen.getByRole("button", { name: label }));
      await screen.findByText(`${label === "Tell me a joke" ? "joke" : label === "Tell me a little about yourself" ? "about" : label === "What are some features of Kyber?" ? "features" : label === "Describe Kyber's architecture" ? "architecture" : label === "How do I get started with Kyber?" ? "gettingStarted" : "contact"} response`);
    }

    expect(container.querySelectorAll(".chat-message")).toHaveLength(6);
    expect(screen.queryByText("Tell me a little about yourself", { selector: "p" })).not.toBeInTheDocument();
    expect(screen.getByText("Tell me a joke", { selector: "p" })).toBeInTheDocument();
  });

  it("renders Matt's contact links", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        command: "contact",
        response: "Matt would love to chat.\n\n- [Email](mailto:matt.voget@gmail.com)\n- [LinkedIn](https://www.linkedin.com/in/matthew-voget-47a225a1/)\n- [GitHub](https://github.com/matty-v)",
        live: true,
      }),
    }));
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Get in touch with Matt" }));
    await screen.findByText("Matt would love to chat.");
    const chat = container.querySelector(".agent-chat");
    expect(chat?.querySelector('a[href="mailto:matt.voget@gmail.com"]')).toBeTruthy();
    expect(chat?.querySelector('a[href="https://www.linkedin.com/in/matthew-voget-47a225a1/"]')).toBeTruthy();
    expect(chat?.querySelector('a[href="https://github.com/matty-v"]')).toBeTruthy();
  });

  it("renders Glyph responses as safe GitHub-flavored Markdown", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          command: "about",
          response: "| Field | Value |\n| --- | --- |\n| Runtime | **Codex** |\n\n<script>alert('no')</script>",
          live: true,
        }),
      }),
    );
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Tell me a little about yourself" }));
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Codex")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
  });

  it("renders Mermaid architecture diagrams in the chat", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          command: "architecture",
          response: "Here’s the shape of Kyber:\n\n```mermaid\nflowchart LR\n  Intent --> Control\n```\n\nThe control plane reconciles intent.",
          live: true,
        }),
      }),
    );
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Describe Kyber's architecture" }));
    expect(await screen.findByRole("figure", { name: "Kyber architecture diagram" })).toBeInTheDocument();
    expect(await screen.findByText("Kyber control plane")).toBeInTheDocument();
  });

  it("renders the Kyber feature highlights and Quickstart link", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          command: "features",
          response: "**Harness choice** — Codex and Claude Code.\n\n[Explore the Kyber Quickstart](https://kyber.voget.io/getting-started/quickstart/)",
          live: true,
        }),
      }),
    );
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "What are some features of Kyber?" }));
    expect(await screen.findByText("Harness choice")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the Kyber Quickstart" })).toHaveAttribute(
      "href",
      "https://kyber.voget.io/getting-started/quickstart/",
    );
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
