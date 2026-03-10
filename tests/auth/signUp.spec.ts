import { test, expect} from '../../fixtures/testFixtures'
import { generateRandomEmail } from '../../utils/passwordGenerator'
import { waitForSignUpVerificationLink } from '../../utils/gmailService'
import { validateSignUpEmail } from '../../utils/resetPasswordEmailValidator'
import { generateRandomPhoneNumber } from '../../utils/passwordGenerator'
import { config } from '../../utils/config'

test.skip(
  process.env.RUN_GMAIL_E2E !== 'true',
  'Set RUN_GMAIL_E2E=true to run Gmail-dependent tests.'
)

test('Sign-up and resend-flow with email verification) @regression @gmail', async ({ page, signUpPage }) => {
    await signUpPage.open()

    await signUpPage.clickSignUpTab()
    await expect(signUpPage.nextButton).toBeEnabled()
    await signUpPage.clickNext()
    await expect(signUpPage.nextButton).toBeDisabled()

    await signUpPage.expectSignUpPageTitle()
    await signUpPage.fillFirstName('Muhammad')
    await signUpPage.fillLastName('Abid')

    // generate one address and reuse it for the resend step
    const email = generateRandomEmail(config.gmailEmail)
    await signUpPage.fillEmail(email)
    await signUpPage.fillPhoneNumber(generateRandomPhoneNumber())
    await signUpPage.fillPassword('Shery@1234')
    await signUpPage.fillConfirmPassword('Shery@1234')
    await signUpPage.expectTermsOfUseAndPrivacyPolicy()
    await expect(signUpPage.nextButton).toBeEnabled()
    await signUpPage.clickNext()
    await signUpPage.expectDisclaimerTexts()

    // --- capture the first sign‑up) email ---
    const { link: firstLink, html: firstHtml } = await waitForSignUpVerificationLink(email)
    validateSignUpEmail(firstHtml)

    // clicking resend should fire a second message
    await signUpPage.clickResendLink()
    // leave page if needed to trigger backend logic
    await signUpPage.clickGoToLogin()

    const { link: secondLink, html: secondHtml } = await waitForSignUpVerificationLink(email)
    expect(secondLink).not.toBe(firstLink)
    validateSignUpEmail(secondHtml)

    console.log(`Sent two emails for ${email}: signup + resend`)
});
