import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class ForgotPasswordPage extends BasePage {
    readonly loginTab: Locator;
    readonly forgotPasswordLink: Locator;
    readonly forgotPasswordPageTitle: Locator;
    readonly emailInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;


    constructor(page: Page) {
        super(page);

        this.loginTab = page.getByRole('link', { name: 'Log In' });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
        this.forgotPasswordPageTitle = page.getByRole('heading', { name: 'Enter your email to recover password' });
        this.emailInput = page.locator("//input[@placeholder='Enter your email']");   // change selector if needed
        this.submitButton = page.getByRole('button', { name: 'Send a Recovery Link' });
        this.successMessage = page.getByText('A recovery link has been sent.'); // Assuming success messages are shown in an element with role 'alert'
        
    }

    async open() {
        await super.open('/');
    }
    async clickLoginTab() {
        await this.loginTab.click();
    }
    async clickforgotPasswordLink() {
        await this.forgotPasswordLink.click();
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async clickSubmit() {
        await this.submitButton.click();
    }

    async expectSuccessMessage() {
        await expect(this.successMessage).toBeVisible();
    }

    async resetPassword(newPassword: string) {
        await expect(this.page.getByRole('heading', { name: 'Create New Password' })).toBeVisible();
        await expect(this.page.locator('input[name="password"]')).toBeVisible();
        await this.page.locator('input[name="password"]').fill(newPassword);
        await expect(this.page.getByPlaceholder('Confirm Password')).toBeVisible();
        await this.page.getByPlaceholder('Confirm Password').fill(newPassword);
        await this.page.getByRole('button', { name: 'Continue' }).click();
    }
    async expectResetSuccess() {
        expect(this.page.url()).toContain('/auth/email/confirm-reset-password')
        await expect(this.page.locator('//h2[text() ="Password Changed"]')).toBeVisible();
        await expect(this.page.getByText('Your password has been changed successfully. You can now log into your account using your new password.')).toBeVisible();
        await expect(this.page.getByText('Please proceed to the login page to access your account.')).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Go to Log In' })).toBeVisible();
        await this.page.getByRole('link', { name: 'Go to Log In' }).click();
        await this.page.waitForURL('https://portal.dev.mehan.ae/auth/login') // Wait for any network requests to complete after clicking Go to Log In     
    }
}