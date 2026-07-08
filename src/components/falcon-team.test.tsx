import { render, screen } from '@testing-library/react'
import { FalconTeam } from './falcon-team'

describe('FalconTeam', () => {
  it('renders the section heading and lede', () => {
    render(<FalconTeam />)
    expect(screen.getByRole('heading', { name: /ships on its own/i })).toBeInTheDocument()
    expect(screen.getByText(/Kubernetes-native platform/i)).toBeInTheDocument()
  })

  it('renders every agent in the pipeline', () => {
    render(<FalconTeam />)
    for (const name of ['Yoda', 'Lando', 'Han', 'Chewie', 'Ackbar']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })

  it('shows the first ticket and a pause control', () => {
    render(<FalconTeam />)
    // ticket id appears in both the status bar and the traveling packet
    expect(screen.getAllByText('SNAP-142').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /pause or resume/i })).toBeInTheDocument()
  })

  it('keeps the sanitized-data disclaimer visible', () => {
    render(<FalconTeam />)
    expect(screen.getByText(/illustrative, sanitized/i)).toBeInTheDocument()
  })
})
