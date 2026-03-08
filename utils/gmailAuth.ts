import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import path from 'path'

export async function authorize(): Promise<OAuth2Client> {

  const auth = await authenticate({
    keyfilePath: path.join(process.cwd(), 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/gmail.readonly']
  }) as unknown as OAuth2Client

  return auth
}