import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays hero section with name', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Matt Voget/i })).toBeVisible()
    await expect(page.getByText(/I lead engineering teams/i)).toBeVisible()
  })

  test('displays the What I\'m Building section with Kyber, the team, and Snapdex', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /What I'm Building/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Kubernetes Native Agent Platform/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'The Falcon Dev Team' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Snapdex' })).toBeVisible()
  })

  test('shows the Falcon Dev Team agents', async ({ page }) => {
    // agent names / roles; some also appear in the Kyber diagram, so match the first
    await expect(page.getByText('Obi-Wan').first()).toBeVisible()
    await expect(page.getByText('Boba-Fett').first()).toBeVisible()
    await expect(page.getByText('Orchestrator').first()).toBeVisible()
    await expect(page.getByText('Ackbar').first()).toBeVisible()
  })

  test('displays contact section with social links', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Get in Touch' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible()
  })

  test('shows the Falcon Dev Team dashboard inline', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /falcon dev team dashboard/i })).toBeVisible()
    await expect(page.getByText(/Last 5 shipped/i)).toBeVisible()
    await expect(page.getByText('#443')).toBeVisible()
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
