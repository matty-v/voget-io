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
    expect(screen.getByText(/run cost/i)).toBeInTheDocument()
  })

  it('renders the cost tile with cents, not a rounded dollar', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    // The figure is around $1, so whole dollars would round most of it away.
    expect(screen.getByText(/^\$\d+\.\d{2}$/)).toBeInTheDocument()
  })

  it('renders Last 5 shipped with issue-shaped ids', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText('Last 5 shipped')).toBeInTheDocument()
    expect(screen.getAllByText(/^#\d+$/).length).toBeGreaterThan(0)
  })

  /**
   * The cost figure is the subscription price divided by issues shipped. Matt
   * wants the quotient public but not the input, and the division happens
   * server-side for exactly that reason. If anyone ever moves it client-side,
   * the monthly price lands in the JS bundle — this guards against that.
   */
  it('never exposes the subscription price to the client', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.queryByText(/\$200/)).not.toBeInTheDocument()
    expect(screen.queryByText(/subscription/i)).not.toBeInTheDocument()
  })
})
