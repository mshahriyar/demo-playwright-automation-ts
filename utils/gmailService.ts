import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'
import { authenticate } from '@google-cloud/local-auth'
import { test } from '@playwright/test'
import * as cheerio from 'cheerio'

test.setTimeout(120000)

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

let gmailClient: ReturnType<typeof google.gmail> | null = null


function extractResetLink(htmlBody: string): string | null {
  const $ = cheerio.load(htmlBody)
  const resetLink = $('a:contains("Reset Password")').attr('href')
  return resetLink || null
}


async function authorize() {
  // helper that reads client info from the credentials JSON
  function makeClient(): OAuth2Client {
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8')
    const data = JSON.parse(content)
    // the file may have either "installed" or "web" properties
    const clientInfo = data.installed || data.web
    const { client_id, client_secret, redirect_uris } = clientInfo
    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
  }

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'))
    const auth = makeClient()
    auth.setCredentials(token)

    // Check if token is expired and try to refresh if we have a refresh token
    if (auth.credentials.expiry_date && auth.credentials.expiry_date < Date.now()) {
      if (auth.credentials.refresh_token) {
        try {
          const refreshed = await auth.refreshAccessToken()
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(auth.credentials))
        } catch (err) {
          // refresh failed (possibly revoked/invalid token). clear saved file
          fs.unlinkSync(TOKEN_PATH)
          return await authorize()
        }
      } else {
        // No refresh token present, force fresh auth
        fs.unlinkSync(TOKEN_PATH)
        return await authorize()
      }
    }
    return auth
  }

  // first time auth flow; request offline access and consent to obtain refresh token
  const auth = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES,
    access_type: 'offline',
    prompt: 'consent'
  } as any)

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(auth.credentials))

  return auth
}


async function getGmailClient() {

  if (gmailClient) return gmailClient

  const auth = await authorize()

  gmailClient = google.gmail({
    version: 'v1',
    auth
  })

  return gmailClient
}


function extractVerifyLink(html: string): string | null {

  const match = html.match(
    /<a[^>]+href="(https:\/\/u\d+\.ct\.sendgrid\.net\/ls\/click[^"]+)"[^>]*>\s*Verify Email\s*<\/a>/i
  )
  // console.log("Extracted verify link:", match?.[1])
  return match ? match[1] : null
}

async function getLatestResetLink(): Promise<{ link: string | null; html: string }> {

  const gmail = await getGmailClient()

  const res = await gmail.users.messages.list({
    userId: 'me',

    // Only fetch recent reset emails
    q: 'to:testqashahriyar3@gmail.com subject:"Password reset request" newer_than:5m',

    maxResults: 10
  })

  const messages = res.data.messages

  if (!messages?.length) {

    console.log('❌ No reset emails found')

    return { link: null, html: '' }
  }

  console.log(`📨 Found ${messages.length} candidate emails`)

  for (const msgRef of messages) {

    try {

      const message = await gmail.users.messages.get({
        userId: 'me',
        id: msgRef.id!
      })

      const payload = message.data.payload
      const parts = payload?.parts

      let htmlBody = ''

      if (parts) {

        const htmlPart = parts.find(
          (p: any) => p.mimeType === 'text/html'
        )

        if (htmlPart?.body?.data) {

          htmlBody = Buffer
            .from(htmlPart.body.data, 'base64')
            .toString('utf8')

        }

      } else if (payload?.body?.data) {

        htmlBody = Buffer
          .from(payload.body.data, 'base64')
          .toString('utf8')

      }

      const link = extractResetLink(htmlBody)

      if (link) {

        console.log(`✅ Reset link found in email ${msgRef.id}`)

        return { link, html: htmlBody }

      }

    } catch (err) {

      console.log('⚠️ Error reading email', err)

    }

  }

  console.log('❌ No reset link found in emails')

  return { link: null, html: '' }
}
export async function waitForResetLink(
  retries = 12,
  delay = 2000,
  initialDelay = 7000
): Promise<{ link: string; html: string }> {

  console.log(`⏳ Waiting ${initialDelay}ms for Gmail indexing...`)

  await new Promise(r => setTimeout(r, initialDelay))

  for (let i = 0; i < retries; i++) {

    const { link, html } = await getLatestResetLink()

    if (link) {

      console.log('\n✅ Reset link extracted successfully\n')

      return { link, html }

    }

    console.log(
      `⏳ Attempt ${i + 1}/${retries} — email not ready, retrying...`
    )

    await new Promise(r => setTimeout(r, delay))

  }

  throw new Error(
    `Reset email not received after ${(initialDelay + retries * delay) / 1000} seconds`
  )
}


async function getLatestSignUpLink(recipientEmail?: string): Promise<{ link: string | null; html: string }> {

  const gmail = await getGmailClient()

  // build search query; include recipient if provided to avoid old messages
  let query = 'subject:"Sign up"'
  if (recipientEmail) {
    query += ` to:${recipientEmail}`
  }

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 20
  })

  const messages = res.data.messages

  if (!messages?.length) {
    console.log('No sign-up emails found in Gmail')
    return { link: null, html: '' }
  }

  console.log(`Found ${messages.length} sign-up emails, checking them in order...`)

  for (const msgRef of messages) {
    try {
      const message = await gmail.users.messages.get({
        userId: 'me',
        id: msgRef.id!
      })

      const payload = message.data.payload
      const parts = payload?.parts

      let htmlBody = ''

      if (parts) {
        const htmlPart = parts.find((p: any) => p.mimeType === 'text/html')
        if (htmlPart?.body?.data) {
          htmlBody = Buffer.from(htmlPart.body.data, 'base64').toString('utf8')
        }
      } else if (payload?.body?.data) {
        htmlBody = Buffer.from(payload.body.data, 'base64').toString('utf8')
      }

      const link = extractVerifyLink(htmlBody)
      
      if (link) {
        console.log(`✓ Found verify link in email ${msgRef.id}`)
        return { link, html: htmlBody }
      } else {
        console.log(`✗ No verify link in email ${msgRef.id}, checking next...`)
      }
    } catch (err) {
      console.log(`Failed to fetch message ${msgRef.id}:`, err)
    }
  }

  console.log('No valid verify link found in any email')
  return { link: null, html: '' }
}


export async function waitForSignUpVerificationLink(
  recipientEmail?: string,
  retries = 12,
  delay = 2000,
  initialDelay = 7000
): Promise<{ link: string; html: string }> {

  console.log(`⏳ Waiting ${initialDelay}ms for Gmail indexing...`)

  await new Promise(r => setTimeout(r, initialDelay))

  for (let i = 0; i < retries; i++) {

    const { link, html } = await getLatestSignUpLink(recipientEmail)

    if (link) {

      console.log('\n✅ Sign-up verification link extracted successfully\n')

      return { link, html }

    }

    console.log(
      `⏳ Attempt ${i + 1}/${retries} — email not ready, retrying...`
    )

    await new Promise(r => setTimeout(r, delay))
  }

  throw new Error('Sign-up verification email not received after ' + (initialDelay + retries * delay) / 1000 + ' seconds')
}