import { test, expect } from '../../fixtures/testFixtures'
import { config } from '../../utils/config'

test('Login with valid credentials', async ({ loginPage }) => {
  await loginPage.open()
  await loginPage.clickLoginTab()
  await loginPage.login(config.loginEmail, config.loginPassword)

  await loginPage.expectLoginSuccess()
})

test('Login with valid email and invalid password', async ({ loginPage }) => {
  await loginPage.open()
  await loginPage.clickLoginTab()
  await loginPage.login(config.loginEmail, 'WrongPassword@123')
  await loginPage.expectWrongPasswordError()
  await loginPage.clickGoBack()
})

test('Login with invalid email', async ({ loginPage }) => {
  await loginPage.open()
  await loginPage.clickLoginTab()
  await loginPage.login('invalid.email@test.com', config.loginPassword)
  await loginPage.expectWrongEmailError()
  await loginPage.clickGoBack()
})

test('Toggle password visibility', async ({ loginPage }) => {
  await loginPage.open()
  await loginPage.clickLoginTab()
  await loginPage.enterPassword(config.loginPassword)
  await loginPage.expectPasswordHidden()
  await loginPage.clickTogglePassword()
  await loginPage.expectPasswordVisible()
  await loginPage.clickTogglePassword()
  await loginPage.expectPasswordHidden()
})