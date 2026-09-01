import { useEffect, useId, useState } from "react";

let mermaidInitialized = false;

type MermaidDiagramProps = {
  chart: string;
};

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId();
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      if (!chart.trim() || chart.length > 4_000) {
        setFailed(true);
        return;
      }

      try {
        const { default: mermaid } = await import("mermaid");
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "base",
            flowchart: { htmlLabels: false, curve: "basis" },
            themeVariables: {
              background: "#1d1c19",
              primaryColor: "#292722",
              primaryTextColor: "#f0eee7",
              primaryBorderColor: "#d4a853",
              lineColor: "#8f8b80",
              secondaryColor: "#24231f",
              tertiaryColor: "#1d1c19",
              fontFamily: "JetBrains Mono, monospace",
            },
          });
          mermaidInitialized = true;
        }

        const id = `glyph-architecture-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
        const valid = await mermaid.parse(chart, { suppressErrors: true });
        if (!valid) throw new Error("Invalid diagram");
        const rendered = await mermaid.render(id, chart);
        if (active) setSvg(rendered.svg);
      } catch {
        if (active) setFailed(true);
      }
    }

    void renderDiagram();
    return () => {
      active = false;
    };
  }, [chart, reactId]);

  if (failed) {
    return <p className="mermaid-error">The architecture diagram could not be rendered.</p>;
  }

  return (
    <figure className="mermaid-diagram" aria-label="Kyber architecture diagram">
      {svg ? (
        <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <span>Rendering architecture…</span>
      )}
    </figure>
  );
}
