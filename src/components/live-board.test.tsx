import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LiveBoard } from './live-board'

describe('LiveBoard', () => {
  it('renders the Falcon Dev Team Dashboard heading', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByRole('heading', { name: /falcon dev team dashboard/i })).toBeInTheDocument()
  })

  it('renders the KPI values', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText('164')).toBeInTheDocument()
    expect(screen.getByText('36')).toBeInTheDocument()
    expect(screen.getByText('$9')).toBeInTheDocument()
  })

  it('renders Last 5 shipped with issue #443', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText('Last 5 shipped')).toBeInTheDocument()
    expect(screen.getByText('#443')).toBeInTheDocument()
  })
})
