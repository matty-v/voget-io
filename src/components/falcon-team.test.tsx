import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FalconTeam } from './falcon-team'

describe('FalconTeam', () => {
  it('renders the issue and shipped end caps', () => {
    render(<FalconTeam />)
    expect(screen.getByText(/SNAP-142/i)).toBeInTheDocument()
    expect(screen.getByText(/merged & deployed to prod/i)).toBeInTheDocument()
  })

  it('renders every agent in handoff order', () => {
    render(<FalconTeam />)
    for (const name of ['Lando', 'Yoda', 'Obi-Wan', 'Han', 'Chewie', 'Boba-Fett', 'Ackbar']) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    }
  })

  it('renders role labels', () => {
    render(<FalconTeam />)
    for (const role of ['Orchestrator', 'Engineer', 'Deploy']) {
      expect(screen.getAllByText(role).length).toBeGreaterThan(0)
    }
  })

  it('renders skill chips as slash commands with no leading star', () => {
    render(<FalconTeam />)
    expect(screen.getAllByText('/implement').length).toBeGreaterThan(0)
    expect(screen.getAllByText('/deploy-to-dev').length).toBeGreaterThan(0)
    expect(screen.queryByText('✦')).not.toBeInTheDocument()
  })
})
