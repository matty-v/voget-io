import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FalconTeam } from './falcon-team'

describe('FalconTeam', () => {
  it('renders the roster and live-work headings', () => {
    render(<FalconTeam />)
    expect(screen.getByText(/who's on the team/i)).toBeInTheDocument()
    expect(screen.getByText(/live work/i)).toBeInTheDocument()
  })

  it('lists every agent in the roster', () => {
    render(<FalconTeam />)
    // some agents (Yoda, Han, Chewie, Ackbar) also appear as kanban column owners,
    // so assert presence rather than uniqueness
    for (const name of ['Yoda', 'Obi-Wan', 'Lando', 'Han', 'Luke', 'Boba-Fett', 'Chewie', 'Ackbar']) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    }
  })

  it('renders the kanban columns', () => {
    render(<FalconTeam />)
    for (const col of ['Triage', 'Building', 'In review', 'Shipped']) {
      expect(screen.getByText(col)).toBeInTheDocument()
    }
  })

  it('has a pause control and the sanitized-data disclaimer', () => {
    render(<FalconTeam />)
    expect(screen.getByRole('button', { name: /pause or resume/i })).toBeInTheDocument()
    expect(screen.getByText(/illustrative, sanitized/i)).toBeInTheDocument()
  })
})
