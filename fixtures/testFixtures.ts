import { test as base, expect } from '@playwright/test'

import { LoginPage } from '../pages/LoginPage'
import { SignUpPage } from '../pages/SignUpPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { HomePage } from '../pages/HomePage'

type MyFixtures = {
  loginPage: LoginPage
  signUpPage: SignUpPage
  forgotPasswordPage: ForgotPasswordPage
  homePage: HomePage
}

export const test = base.extend<MyFixtures>({

  loginPage: ({ page }, use) => use(new LoginPage(page)),
  signUpPage: ({ page }, use) => use(new SignUpPage(page)),
  forgotPasswordPage: ({ page }, use) => use(new ForgotPasswordPage(page)),
  homePage: ({ page }, use) => use(new HomePage(page)),

})

export { expect } 