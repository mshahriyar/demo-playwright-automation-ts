import { defineConfig, devices } from '@playwright/test';
import { config } from './utils/config';
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: config.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [

  /* Setup project - logs in once and saves auth state */
  {
    name: 'setup',
    testMatch: /setup\/auth\.setup\.ts/,
    use: { ...devices['Desktop Chrome'] },
  },

  /* Authenticated tests (Home, Dashboard, etc) */
  {
    name: 'authenticated-tests',
    testMatch: /tests\/app\/.*\.spec\.ts/,
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json'
    },
    dependencies: ['setup'],
  },

  /* Authentication validation tests */
  {
    name: 'auth-tests',
    testMatch: /tests\/auth\/.*\.spec\.ts/,
    use: { ...devices['Desktop Chrome'] },
  }

],


});
