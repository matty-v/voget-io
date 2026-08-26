# Systems Index design specification

Approved direction for the voget.io homepage, August 2026.

## Thesis

Quiet interface, loud proof. The site should feel like an engineer's working index: operational, precise, and technically alive without terminal cosplay or decorative telemetry.

## Visual system

- Warm soot background (`#11110f`) and bone text (`#eae7df`)
- Safety orange (`#ff5c35`) is reserved for active state and links
- Warm grotesk headings and body copy; monospace only for indexes, status, and metadata
- Hairline rules and disciplined spacing replace gradients, glass cards, particles, scanlines, and glow
- Desktop uses a persistent index rail; mobile uses a compact sticky header and reflowed content

## Content hierarchy

1. Matt's role and a direct positioning statement
2. Kyber as the active featured project
3. A truthful, simplified architecture model
4. Current platform signals stated without fake timestamps or fabricated metrics
5. An extensible project index
6. Compact identity, contact, and legal links

## Responsive behavior

- The Kyber architecture becomes a vertical operator → control plane → agent pods flow
- Capability cells wrap instead of shrinking
- Facts stack and project rows collapse to readable multi-line entries
- No horizontal scrolling at a 320px viewport

The raster mockups under `/persist/voget-mockups` were direction studies. This document and the implemented responsive layout are the build specification.
