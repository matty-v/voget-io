import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LiveBoard } from './live-board'

describe('LiveBoard', () => {
  it('renders the four columns and the heading (falls back to sample data)', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByRole('heading', { name: /live board/i })).toBeInTheDocument()
    for (const col of ['Triage', 'Building', 'In review', 'Shipped']) {
      expect(screen.getByText(col)).toBeInTheDocument()
    }
  })

  it('shows sanitized cards (numbers, no titles)', () => {
    render(<LiveBoard onNavigate={() => {}} />)
    expect(screen.getByText('#445')).toBeInTheDocument()
    expect(screen.getByText('luke')).toBeInTheDocument()
  })
})
