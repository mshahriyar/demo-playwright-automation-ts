import dotenv from 'dotenv'

dotenv.config({ quiet: true })

type AppConfig = {
  loginEmail: string
  loginPassword: string
  baseUrl: string
  gmailEmail: string
  forgotPasswordEmail: string
  defaultTimeout: number
  mailWaitTimeout: number
  environment: string
  isProduction: boolean
}

export const config: AppConfig = {
  loginEmail: process.env.LOGIN_EMAIL ?? '',
  loginPassword: process.env.LOGIN_PASSWORD ?? '',

  baseUrl: process.env.BASE_URL ?? 'https://portal.dev.mehan.ae',

  gmailEmail: process.env.GMAIL_EMAIL ?? '',
  forgotPasswordEmail: process.env.FORGOT_PASSWORD_EMAIL ?? process.env.GMAIL_EMAIL ?? '',

  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT ?? '30000', 10),
  mailWaitTimeout: parseInt(process.env.MAIL_WAIT_TIMEOUT ?? '60000', 10),

  environment: process.env.ENVIRONMENT ?? 'dev',
  isProduction: process.env.ENVIRONMENT === 'prod'
}

// Validate required values
if (!config.loginEmail || !config.loginPassword) {
  throw new Error(
    'LOGIN_EMAIL and LOGIN_PASSWORD must be defined in environment variables'
  )
}
