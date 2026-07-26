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
    expect(screen.getByText(/cost \/ issue/i)).toBeInTheDocument()
    expect(screen.getByText(/at published API rates/i)).toBeInTheDocument()
  })

  it('renders money as a formatted magnitude, not a raw number', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    // "$63" / "$253K" — never "253032", and never blank.
    expect(screen.getAllByText(/^\$\d+(\.\d+)?[KM]?$/).length).toBeGreaterThan(0)
  })

  it('renders Last 5 shipped with issue-shaped ids', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText('Last 5 shipped')).toBeInTheDocument()
    expect(screen.getAllByText(/^#\d+$/).length).toBeGreaterThan(0)
  })

  /**
   * The load-bearing test. A dollar figure on this page is defensible only while
   * it is visibly labelled as a rate-based estimate rather than an invoice — the
   * fleet runs on a subscription, so an unqualified "$253K" would be a false
   * claim about money someone spent. If a redesign ever drops these qualifiers,
   * this should fail rather than ship quietly.
   */
  it('never shows money without saying it is notional', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getAllByText(/^\$\d/).length).toBeGreaterThan(0)
    expect(screen.getByText(/at published API rates/i)).toBeInTheDocument()
    // getAllByText: "run-rate" appears on the figure and again in the
    // methodology. Both are the qualifier doing its job, so assert ≥1, not ==1.
    expect(screen.getAllByText(/run.rate/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/cost-to-produce figure, not a bill/i)).toBeInTheDocument()
  })

  it('states the human role — the claim is not "no humans"', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText(/one human reviews and merges/i)).toBeInTheDocument()
  })

  it('discloses the methodology on the page, not behind a link', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText(/how this is measured/i)).toBeInTheDocument()
    // The two caveats most likely to be quietly dropped in a redesign.
    expect(screen.getByText(/work that never shipped/i)).toBeInTheDocument()
    expect(screen.getByText(/counted the same message more than once/i)).toBeInTheDocument()
  })
})
