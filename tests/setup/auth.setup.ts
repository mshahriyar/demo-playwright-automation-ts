import { test as setup } from '@playwright/test'
import { config } from '../../utils/config'

/**
 * Authentication setup - runs once before all tests
 * Logs in and saves the browser state (cookies, localStorage, etc.)
 * All subsequent tests reuse this authenticated state
 */
setup('authenticate user @smoke @sanity @regression', async ({ page }) => {
  console.log('🔐 Authenticating user...')

  // Navigate to login
  await page.goto(config.baseUrl + '/auth/login')

  // Fill credentials
  await page.getByPlaceholder('Enter your email').fill(config.loginEmail)
  await page.getByPlaceholder('Enter a password').fill(config.loginPassword)

  // Submit form and wait for navigation
  await page.getByRole('button', { name: 'Log In' }).click()

  // Wait for home page to load (indicates successful login)
  await page.waitForURL(`${config.baseUrl}/home`, { timeout: 30000 })

  // Save authenticated state (cookies, localStorage, sessionStorage)
  await page.context().storageState({ path: 'playwright/.auth/user.json' })

  console.log('✅ Authentication successful - state saved')
})
