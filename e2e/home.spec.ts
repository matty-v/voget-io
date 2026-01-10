import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays hero section with name', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Matt Voget/i })).toBeVisible()
    await expect(page.getByText(/I lead engineering teams/i)).toBeVisible()
  })

  test('displays projects section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
    await expect(page.getByText('Google Drive MCP Server', { exact: true })).toBeVisible()
    await expect(page.getByText('Sheets DB API', { exact: true })).toBeVisible()
    await expect(page.getByText('Lifting Tracker', { exact: true })).toBeVisible()
  })

  test('displays contact section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Get in Touch' })).toBeVisible()
  })

  test('has working navigation to Projects section', async ({ page }) => {
    await page.getByRole('link', { name: 'View Projects' }).click()
    await expect(page.locator('#projects')).toBeInViewport()
  })

  test('has working navigation to Contact section', async ({ page }) => {
    await page.getByRole('link', { name: 'Get in Touch' }).click()
    await expect(page.locator('#contact')).toBeInViewport()
  })
})

test.describe('Privacy Policy Page', () => {
  test('navigates to privacy policy and back', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Privacy Policy' }).click()

    await expect(page).toHaveURL('/privacy')
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()

    await page.getByRole('link', { name: 'Back to Home' }).click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Terms Page', () => {
  test('navigates to terms and conditions and back', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Terms and Conditions' }).click()

    await expect(page).toHaveURL('/terms')
    await expect(page.getByRole('heading', { name: 'Terms and Conditions' })).toBeVisible()

    await page.getByRole('link', { name: 'Back to Home' }).click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Social Links', () => {
  test('has GitHub link with correct href', async ({ page }) => {
    await page.goto('/')
    const githubLink = page.getByRole('link', { name: 'GitHub' })
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/matty-v')
  })

  test('has LinkedIn link with correct href', async ({ page }) => {
    await page.goto('/')
    const linkedinLink = page.getByRole('link', { name: 'LinkedIn' })
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/matthew-voget-47a225a1/')
  })

  test('has Email link with correct href', async ({ page }) => {
    await page.goto('/')
    const emailLink = page.getByRole('link', { name: 'Email' })
    await expect(emailLink).toHaveAttribute('href', 'mailto:matt.voget@gmail.com')
  })
})
