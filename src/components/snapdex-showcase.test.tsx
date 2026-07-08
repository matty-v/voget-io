import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SnapdexShowcase } from './snapdex-showcase'

// jsdom doesn't implement matchMedia; the component's autoplay effect calls it
// to respect prefers-reduced-motion, so stub it for this test environment.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

describe('SnapdexShowcase', () => {
  it('renders the Snapdex heading', () => {
    render(<SnapdexShowcase />)
    expect(screen.getByRole('heading', { name: /snapdex/i })).toBeInTheDocument()
  })

  it('renders the Falcon Dev Team claim', () => {
    render(<SnapdexShowcase />)
    expect(screen.getByText(/falcon dev team/i)).toBeInTheDocument()
  })

  it('links to snapdex.ai', () => {
    render(<SnapdexShowcase />)
    const link = screen.getByRole('link', { name: /visit snapdex\.ai/i })
    expect(link).toHaveAttribute('href', 'https://snapdex.ai')
  })

  it('renders all four carousel slide images', () => {
    // Query raw <img> elements rather than getAllByRole('img') — the inline
    // dex-scanner logo SVGs also carry role="img", so a role query would
    // over-count. This targets just the screenshot slides.
    const { container } = render(<SnapdexShowcase />)
    expect(container.querySelectorAll('img')).toHaveLength(4)
  })
})
