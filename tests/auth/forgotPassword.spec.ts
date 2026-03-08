import { test, expect } from '../../fixtures/testFixtures'
import { waitForResetLink } from '../../utils/gmailService'
import { validateResetEmail } from '../../utils/resetPasswordEmailValidator'
import { generatePassword } from '../../utils/passwordGenerator'

test.skip(
  process.env.RUN_GMAIL_E2E !== 'true',
  'Set RUN_GMAIL_E2E=true to run Gmail-dependent tests.'
)

test('Forgot Password Flow', async ({ forgotPasswordPage, page }) => {

    await forgotPasswordPage.open()

    await forgotPasswordPage.clickLoginTab()

    await forgotPasswordPage.clickforgotPasswordLink()

    await expect(forgotPasswordPage.forgotPasswordPageTitle).toBeVisible()

    await forgotPasswordPage.enterEmail('testqashahriyar3@gmail.com')

    await forgotPasswordPage.clickSubmit()

    await forgotPasswordPage.expectSuccessMessage()

    const { link, html } = await waitForResetLink()

    // Validate email content
    validateResetEmail(html)

    await page.goto(link) 
    const newPassword = generatePassword()
    console.log(`Generated password for reset: ${newPassword}`)
    
    await forgotPasswordPage.resetPassword(newPassword)   
    await page.waitForLoadState('networkidle')  
    await forgotPasswordPage.expectResetSuccess() 
    expect(page.url()).toContain('https://portal.dev.mehan.ae/auth/login')       
})
