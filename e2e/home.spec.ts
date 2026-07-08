import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays hero section with name', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Matt Voget/i })).toBeVisible()
    await expect(page.getByText(/I lead engineering teams/i)).toBeVisible()
  })

  test('displays the My Work section with Kyber, the team, and Snapdex', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Work' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Kyber' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'The Falcon Dev Team' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Snapdex' })).toBeVisible()
  })

  test('shows the Falcon team roster and live kanban', async ({ page }) => {
    // agent names also appear in the Kyber diagram pods, so match the first
    await expect(page.getByText('Obi-Wan').first()).toBeVisible()
    await expect(page.getByText('Boba-Fett').first()).toBeVisible()
    await expect(page.getByText(/live work/i)).toBeVisible()
    await expect(page.getByText('Triage', { exact: true })).toBeVisible()
    await expect(page.getByText('Shipped', { exact: true })).toBeVisible()
  })

  test('displays contact section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Get in Touch' })).toBeVisible()
  })

  test('has working navigation to My Work section', async ({ page }) => {
    await page.getByRole('link', { name: 'My Work' }).click()
    await expect(page.locator('#work')).toBeInViewport()
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
