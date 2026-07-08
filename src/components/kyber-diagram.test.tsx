import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KyberDiagram } from './kyber-diagram'

describe('KyberDiagram', () => {
  it('renders the operator and the comms channels', () => {
    render(<KyberDiagram />)
    expect(screen.getByText(/You/)).toBeInTheDocument()
    for (const channel of ['Telegram', 'Discord', 'Slack']) {
      expect(screen.getByText(channel)).toBeInTheDocument()
    }
  })

  it('renders the Kyber UI panel with fleet bars and the terminal', () => {
    render(<KyberDiagram />)
    // context-budget bars (Han appears here and as a pod, so allow multiple)
    expect(screen.getAllByText('Han').length).toBeGreaterThan(0)
    expect(screen.getByText('308k/1M')).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
    // xterm running Han on claude-code
    expect(screen.getByText(/agent: Han/)).toBeInTheDocument()
    expect(screen.getByText(/SNAP-142/)).toBeInTheDocument()
  })

  it('renders the control plane and the cluster boundary markers', () => {
    render(<KyberDiagram />)
    expect(screen.getByText(/Control plane/)).toBeInTheDocument()
    expect(screen.getByText(/Kubernetes cluster/)).toBeInTheDocument()
    // API / Webhook marker sits on the boundary (label also appears on a connector)
    expect(screen.getAllByText(/API \/ Webhook/).length).toBeGreaterThan(0)
  })

  it('renders the three agent pods with their runtimes', () => {
    render(<KyberDiagram />)
    for (const name of ['Yoda', 'Chewie']) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    }
    for (const runtime of ['Codex', 'Claude Code', 'OpenClaw']) {
      expect(screen.getByText(runtime)).toBeInTheDocument()
    }
    expect(screen.getByText(/running/)).toBeInTheDocument()
  })
})
