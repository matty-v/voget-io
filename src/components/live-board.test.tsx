import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LiveBoard } from './live-board'

/**
 * These render the first-visit fallback: jsdom has no live feed, so the fetch
 * fails and the component keeps its initial state.
 *
 * Assert SHAPE, not literal values. The previous version pinned '164', '$9' and
 * '#443' — all of which came from the fallback constant, and all of which broke
 * the moment it was updated. That is a test failing on a change that isn't a
 * bug. Where something specific is asserted below it's a rendering rule (a
 * formatted magnitude, an issue-shaped id), never today's numbers.
 */
describe('LiveBoard', () => {
  it('renders the Falcon Dev Team Dashboard heading', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByRole('heading', { name: /falcon dev team dashboard/i })).toBeInTheDocument()
  })

  it('labels the KPI tiles', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText(/tokens \/ issue/i)).toBeInTheDocument()
    expect(screen.getByText(/team token spend \/ shipped/i)).toBeInTheDocument()
  })

  it('renders the token tile as a formatted magnitude, not a raw count', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    // "99M" / "1.2B" — never "98958000", and never blank.
    expect(screen.getByText(/^\d+(\.\d+)?[KMB]$/)).toBeInTheDocument()
  })

  it('renders Last 5 shipped with issue-shaped ids', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText('Last 5 shipped')).toBeInTheDocument()
    expect(screen.getAllByText(/^#\d+$/).length).toBeGreaterThan(0)
  })

  it('shows no dollar figure — the fleet runs on a subscription, not per-token billing', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.queryByText(/^\$\d/)).not.toBeInTheDocument()
  })
})
