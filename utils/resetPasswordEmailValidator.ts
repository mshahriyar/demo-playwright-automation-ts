import * as cheerio from 'cheerio'

export function validateResetEmail(html: string): void {
  const $ = cheerio.load(html)

  // Logo
  if ($('img[alt="logo"]').length === 0) {
    throw new Error('Logo not found in email')
  }

  // Greeting
  const greetingText = $('div[class*="greeting"]').text().trim()
  if (!greetingText.includes('Hi Muhammad Shahriyar,')) {
    throw new Error('Greeting not found or incorrect in email')
  }

  // Body Text
  const bodyText = $('div[class*="textblock"]').first().text()
  if (!bodyText.includes('We received a request to reset the password for your Smart Mehan account.')) {
    throw new Error('First body text not found in email')
  }
  if (!bodyText.includes('If you made this request, you can set a new password using the link below:')) {
    throw new Error('Second body text not found in email')
  }

  // Reset button
  if ($('a:contains("Reset Password")').length === 0) {
    throw new Error('Reset Password button not found in email')
  }

  // Footer content
  const footerText = $('div[class*="footer-info"] p').text()
  if (!footerText.includes('© 2026 Smart Mehan LLC. UAE, Dubai, Emaar Square, Building 6, Burj Khalifa Street, Office 404.')) {
    throw new Error('Footer content not found or incorrect in email')
  }

  // Social icons
  if ($('img[alt="X (Twitter)"]').length === 0) {
    throw new Error('X (Twitter) social icon not found in email')
  }
  if ($('img[alt="Facebook"]').length === 0) {
    throw new Error('Facebook social icon not found in email')
  }
  if ($('img[alt="Instagram"]').length === 0) {
    throw new Error('Instagram social icon not found in email')
  }
}


export function validateSignUpEmail(html: string): void {
  const $ = cheerio.load(html)

  // Logo
  if ($('img[alt="logo"]').length === 0) {
    throw new Error('Logo not found in sign-up email')
  }

  // Greeting
  const greetingText = $('div[class*="greeting"]').text().trim()
  if (!greetingText.includes('Hi Muhammad Abid,')) {
    throw new Error('Greeting not found or incorrect in sign-up email')
  }

  // Body Text
  const bodyText = $('div[class*="textblock"]').first().text()
  if (!bodyText.includes('Thank you for signing up!')) {
    throw new Error('First body text not found in sign-up email')
  }
  if (!bodyText.includes('To complete your registration and activate your account, please verify your email address by clicking the button below:')) {
    throw new Error('Second body text not found in sign-up email')
  }

  // Verify button
  if ($('a:contains("Verify Email")').length === 0) {
    throw new Error('Verify Email button not found in sign-up email')
  }

  // Footer content
  const footerText = $('div[class*="footer-info"] p').text()
  if (!footerText.includes('© 2026 Smart Mehan LLC. UAE, Dubai, Emaar Square, Building 6, Burj Khalifa Street, Office 404.')) {
    throw new Error('Footer content not found or incorrect in email')
  }
  // Social icons
  if ($('img[alt="X (Twitter)"]').length === 0) {
    throw new Error('X (Twitter) social icon not found in sign-up email')
  }
  if ($('img[alt="Facebook"]').length === 0) {
    throw new Error('Facebook social icon not found in sign-up email')
  }
  if ($('img[alt="Instagram"]').length === 0) {
    throw new Error('Instagram social icon not found in sign-up email')
  }
}