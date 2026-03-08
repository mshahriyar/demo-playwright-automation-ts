import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class LoginPage extends BasePage {
    readonly loginTab: Locator;
    readonly loginPageTitle: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly authErrorTitle: Locator;
    readonly authErrorMessages: Locator;
    readonly authErrorModal: Locator;
    readonly goBackButton: Locator;
    readonly togglePasswordButton: Locator;


    constructor(page: Page) {
        super(page);

        this.loginTab = page.getByRole('link', { name: 'Log In' });
        this.loginPageTitle = page.getByRole('heading', { name: 'Log in to your business account' });
        this.emailInput = page.getByRole('textbox', { name: 'email' });      // change selector if needed
        this.passwordInput = page.getByRole('textbox', { name: 'password' });
        this.loginButton = page.getByRole('button', { name: 'Log In' });

        //invalid passsword error
        this.errorMessage = page.getByText('Password must contain at least one upper-case letter'); // Assuming error messages are shown in an element with role 'alert'

        //Invalid Email Dialog
        this.authErrorModal = page.getByRole('dialog');

        this.authErrorTitle = this.authErrorModal.getByText('Authorization Error');

        this.authErrorMessages = this.authErrorModal.locator('p');

        this.goBackButton = this.authErrorModal.getByRole('link', { name: 'Go back' });

        //show/hide password toggle buggon
        this.togglePasswordButton = this.passwordInput.locator('xpath=following-sibling::button');

    }

    async open() {
        await super.open('/ ');
    }

    async clickLoginTab() {
        await this.loginTab.click();
    }
    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }
    async expectLoginSuccess() {
    await expect(this.page).toHaveURL(/home/)
    }
    async expectAuthModalVisible() {
        await expect(this.authErrorModal).toBeVisible()
        await expect(this.authErrorTitle).toBeVisible()
    }
    async expectWrongPasswordError() {
       await this.expectAuthModalVisible()
        await expect(this.authErrorMessages).toHaveText([
            'You are not eligible to access this service.',
            'Error: Invalid password',
            'Please contact our Customer Service to access the service.'
        ]);
        await expect(this.goBackButton).toBeVisible();        
    }

    async expectWrongEmailError() {
        await this.expectAuthModalVisible()
        await expect(this.authErrorMessages).toHaveText([
            'You are not eligible to access this service.',
            'Error: User not found or email is not verified!',
            'Please contact our Customer Service to access the service.'
        ]);

        await expect(this.goBackButton).toBeVisible();
    }
    async clickGoBack() {
        await this.goBackButton.click();
        await expect(this.loginPageTitle).toBeVisible();
    }

    async clickTogglePassword() {
        await this.togglePasswordButton.click();
    }

    async expectPasswordHidden() {
        await expect(this.passwordInput).toHaveAttribute('type', 'password');
    }

    async expectPasswordVisible() {
        await expect(this.passwordInput).toHaveAttribute('type', 'text');
    }


}