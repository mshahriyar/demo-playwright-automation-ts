import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class SignUpPage extends BasePage {
    readonly signUpTab: Locator;
    readonly signUpPageTitle: Locator;
    readonly fillDetailsHeading: Locator;
    readonly personalStep: Locator;
    readonly verificationStep: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly nextButton: Locator;
    readonly termsOfUseLink: Locator;
    readonly privacyPolicyLink: Locator;
    readonly disclaimerText1: Locator;
    readonly disclaimerText2: Locator;
    readonly resendLinkButton: Locator;
    readonly goToLoginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.signUpTab = page.getByRole('link', { name: 'Sign Up' });
        this.signUpPageTitle = page.getByText('Good start');
        this.fillDetailsHeading = page.getByText('Fill your details');
        this.personalStep = page.getByText('Personal');
        this.verificationStep = page.getByText('Verification');
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('Enter your email');
        this.phoneNumberInput = page.getByPlaceholder('Phone Number');
        this.passwordInput = page.getByPlaceholder('Create a password');
        this.confirmPasswordInput = page.getByPlaceholder('Confirm password');
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.termsOfUseLink = page.getByRole('link', { name: 'Terms of Use' });
        this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
        this.disclaimerText1 = page.getByText("Didn't receive the link? Please check your spam folder or");
        this.disclaimerText2 = page.getByText('We have sent a link to');
        this.resendLinkButton = page.getByRole('button', { name: 'click here to resend the link.' });
        this.goToLoginButton = page.getByRole('button', { name: 'Go to Login' });
    }

    async open() {
        await super.open('/');
    }

    async clickSignUpTab() {
        await this.signUpTab.click();
    }

    async fillFirstName(firstName: string) {
        await this.firstNameInput.fill(firstName);
    }

    async fillLastName(lastName: string) {
        await this.lastNameInput.fill(lastName);
    }

    async fillEmail(email: string){
        await this.emailInput.fill(email);
    }

    async fillPhoneNumber(phoneNumber: string) {
        await this.phoneNumberInput.fill(phoneNumber);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(confirmPassword: string) {
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    async clickNext() {
        await this.nextButton.click();
    }

    async expectSignUpPageTitle() {
        await expect(this.signUpPageTitle).toBeVisible();
        await expect(this.fillDetailsHeading).toBeVisible();
        await expect(this.personalStep).toHaveClass(/steps_active/);
        await expect(this.verificationStep).toHaveClass(/steps_pending/);
    }

    async expectTermsOfUseAndPrivacyPolicy() {
        await expect(this.termsOfUseLink).toBeVisible();
        await expect(this.privacyPolicyLink).toBeVisible();
    }

    async expectDisclaimerTexts() {
        await expect(this.disclaimerText1).toBeVisible();
        await expect(this.disclaimerText2).toBeVisible();
        await expect(this.resendLinkButton).toBeVisible();
    }
    async clickResendLink() {
        await this.resendLinkButton.click();
    }

    async clickGoToLogin() {
        await this.goToLoginButton.click();
    }

    async expectVerificationSuccess(){
        await this.page.waitForURL(/sign-up-verification-success/, { timeout: 30000 });
        const errorText = this.page.locator('text=Your verification link is expired or invalid').first();
        if (await errorText.count()) {
          throw new Error('Navigated to verification error page instead of success');
        }
        await expect(this.page.locator("//h2[text() ='Verification Successful']")).toBeVisible();
        await expect(this.page.getByText('Your account has been successfully verified.')).toBeVisible();
        await expect(this.page.getByText('You can now access all features of our service.')).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Go to Log In' })).toBeVisible();
    }

}