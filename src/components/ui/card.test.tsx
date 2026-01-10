import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies base classes', () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('rounded-xl')
    expect(card).toHaveClass('text-card-foreground')
  })

  it('merges custom className', () => {
    render(<Card data-testid="card" className="custom-class">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-class')
    expect(card).toHaveClass('rounded-xl')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Card ref={ref}>Content</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('applies base classes', () => {
    render(<CardHeader data-testid="header">Content</CardHeader>)
    const header = screen.getByTestId('header')
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
  })

  it('merges custom className', () => {
    render(<CardHeader data-testid="header" className="custom">Content</CardHeader>)
    const header = screen.getByTestId('header')
    expect(header).toHaveClass('custom')
    expect(header).toHaveClass('p-6')
  })
})

describe('CardTitle', () => {
  it('renders children correctly', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('applies base classes', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    const title = screen.getByTestId('title')
    expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight')
  })
})

describe('CardDescription', () => {
  it('renders children correctly', () => {
    render(<CardDescription>Description</CardDescription>)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('applies base classes', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    const desc = screen.getByTestId('desc')
    expect(desc).toHaveClass('text-sm', 'text-muted-foreground')
  })
})

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies base classes', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('p-6', 'pt-0')
  })
})

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies base classes', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    const footer = screen.getByTestId('footer')
    expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
  })
})

describe('Card compound component', () => {
  it('renders a complete card with all sub-components', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>My Title</CardTitle>
          <CardDescription>My Description</CardDescription>
        </CardHeader>
        <CardContent>Main content here</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    )

    expect(screen.getByText('My Title')).toBeInTheDocument()
    expect(screen.getByText('My Description')).toBeInTheDocument()
    expect(screen.getByText('Main content here')).toBeInTheDocument()
    expect(screen.getByText('Footer actions')).toBeInTheDocument()
  })
})
