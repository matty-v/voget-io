const PODS = [
  { glyph: 'Y', name: 'Yoda', role: 'Product', ac: 'var(--accent-cyan)' },
  { glyph: 'O', name: 'Obi-Wan', role: 'Architect', ac: 'var(--accent-cyan)' },
  { glyph: 'H', name: 'Han', role: 'Engineer', ac: 'var(--accent-purple)' },
  { glyph: 'L', name: 'Luke', role: 'Engineer', ac: 'var(--accent-purple)' },
  { glyph: 'B', name: 'Boba-Fett', role: 'QA', ac: 'var(--accent-pink)' },
  { glyph: 'C', name: 'Chewie', role: 'Review', ac: 'var(--accent-pink)' },
  { glyph: 'A', name: 'Ackbar', role: 'Deploy', ac: 'var(--accent-green)' },
]

export function KyberDiagram() {
  return (
    <div className="kyber-diagram">
      <div className="kyber-cluster">
        <span className="kyber-cluster-tab">Kubernetes cluster</span>

        <div className="kyber-cp">
          <span className="kyber-hex">&#x2B22;</span>
          <span className="kyber-cp-name">Lando &middot; orchestrator</span>
          <span className="kyber-cp-sub">dispatch &middot; webhooks</span>
        </div>

        <div className="kyber-bus" aria-hidden="true">
          <span className="kyber-bus-dot" />
          <span className="kyber-bus-dot d2" />
          <span className="kyber-bus-dot d3" />
        </div>

        <div className="kyber-pods">
          {PODS.map((p) => (
            <div key={p.name} className="kyber-pod" style={{ ['--ac' as string]: p.ac }}>
              <span className="kyber-pod-stub" aria-hidden="true" />
              <div className="kyber-pod-bar">
                <i />
                <i />
                <i />
                <span>pod</span>
              </div>
              <div className="kyber-pod-body">
                <span className="kyber-pod-glyph">{p.glyph}</span>
                <span className="kyber-pod-name">{p.name}</span>
                <span className="kyber-pod-role">{p.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
