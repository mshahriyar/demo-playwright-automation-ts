# Playwright E2E Automation (TypeScript)

End-to-end UI automation framework for the Smart Mehan portal using Playwright + TypeScript, with Page Object Model (POM), reusable fixtures, and optional Gmail-based email validation flows.

## What This Project Covers

- Authentication tests
  - Login success and failure scenarios
  - Password visibility toggle
  - Forgot password flow
  - Sign-up flow with resend verification
- Authenticated dashboard tests
  - Home page load validation
  - Dashboard card visibility, counts, and navigation
- Optional Gmail-driven checks
  - Read reset-password emails
  - Read sign-up verification emails
  - Validate email content and links

## Tech Stack

- [Playwright Test](https://playwright.dev/)
- TypeScript
- Node.js
- `googleapis` + `@google-cloud/local-auth` (for Gmail flows)
- `cheerio` (for email HTML parsing)

## Project Structure

```text
.
├── fixtures/
│   └── testFixtures.ts
├── pages/
│   ├── base/BasePage.ts
│   ├── LoginPage.ts
│   ├── ForgotPasswordPage.ts
│   ├── SignUpPage.ts
│   └── HomePage.ts
├── tests/
│   ├── setup/auth.setup.ts
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── forgotPassword.spec.ts
│   │   └── signUp.spec.ts
│   └── app/
│       └── home.spec.ts
├── utils/
│   ├── config.ts
│   ├── gmailAuth.ts
│   ├── gmailService.ts
│   ├── passwordGenerator.ts
│   └── resetPasswordEmailValidator.ts
├── playwright.config.ts
├── package.json
└── .github/workflows/playwright.yml
```

## Test Architecture

This framework uses:

- **POM (Page Object Model):** page-level UI actions and assertions are centralized in `pages/`.
- **Custom fixtures:** page objects are injected through `fixtures/testFixtures.ts`.
- **Playwright projects:** defined in `playwright.config.ts`
  - `setup`: logs in once and stores auth state
  - `authenticated-tests`: reuses saved auth state for app tests
  - `auth-tests`: login/sign-up/forgot-password scenarios

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+
- Google Chrome/Chromium dependencies (installed by Playwright)
- Access to the target environment:
  - Default base URL: `https://portal.dev.mehan.ae`

## Local Setup

1. Clone the repository

```bash
git clone <your-repo-url>
cd demo-playwright-automation-ts
```

2. Install dependencies

```bash
npm ci
```

3. Install Playwright browser(s)

```bash
npx playwright install chromium
```

4. Create environment file

Create `.env` in project root:

```env
LOGIN_EMAIL=your_login_email
LOGIN_PASSWORD=your_login_password
BASE_URL=https://portal.dev.mehan.ae
GMAIL_EMAIL=your_test_gmail@gmail.com
RUN_GMAIL_E2E=false
DEFAULT_TIMEOUT=30000
MAIL_WAIT_TIMEOUT=60000
ENVIRONMENT=dev
```

Notes:

- `LOGIN_EMAIL` and `LOGIN_PASSWORD` are required by `utils/config.ts`.
- Keep `.env`, `credentials.json`, and `token.json` private (already ignored by `.gitignore`).

## Run Tests

Run all tests:

```bash
npm run test:e2e
```

Run with CI-style reporter:

```bash
npm run test:ci
```

Run smoke suite (fast, no Gmail):

```bash
npm run smoke
```

Run sanity suite (broader, no Gmail):

```bash
npm run sanity
```

Run regression suite (includes Gmail tests by default):

```bash
npm run regression
```

Run regression without Gmail:

```bash
npm run regression:no-gmail
```

Run headed mode:

```bash
npm run test:headed
```

Run a specific file:

```bash
npx playwright test tests/auth/login.spec.ts
```

Run only dashboard tests:

```bash
npx playwright test tests/app/home.spec.ts
```

Run only Gmail-dependent tests (local):

```bash
RUN_GMAIL_E2E=true npx playwright test tests/auth/forgotPassword.spec.ts tests/auth/signUp.spec.ts
```

## Gmail Tests (Local-Only, Secure Setup)

The Gmail tests are intentionally skippable and should remain disabled for normal CI in public repositories.

### 1) Use a dedicated test Gmail account

- Create a separate inbox for automation (do not use a personal mailbox).
- Use that mailbox only for test notifications.

### 2) Create Google Cloud OAuth credentials

1. Go to Google Cloud Console.
2. Create/select a project.
3. Enable **Gmail API**.
4. Configure OAuth consent screen.
5. Create OAuth Client ID (Desktop App is easiest for local flow).
6. Download the OAuth client file and save it as:

```text
credentials.json
```

at project root.

### 3) Generate local token

On first Gmail test run, Playwright helper code triggers an OAuth browser flow and stores:

```text
token.json
```

in project root.

Run:

```bash
RUN_GMAIL_E2E=true npx playwright test tests/auth/forgotPassword.spec.ts
```

Complete consent once. Future runs reuse `token.json` and refresh automatically when possible.

### 4) Configure `.env`

Set the automation inbox:

```env
GMAIL_EMAIL=your_test_gmail@gmail.com
RUN_GMAIL_E2E=true
```

### 5) Project-specific Gmail defaults to adjust

This repository now uses env-driven Gmail targets:

- `GMAIL_EMAIL`:
  - Base inbox for sign-up email alias generation (`name+random@domain`)
  - Recipient filter for sign-up verification polling
- `FORGOT_PASSWORD_EMAIL`:
  - Email entered in forgot-password flow
  - Recipient filter for reset email polling

Recommended local `.env`:

```env
GMAIL_EMAIL=your_test_gmail@gmail.com
FORGOT_PASSWORD_EMAIL=your_registered_test_user@gmail.com
RUN_GMAIL_E2E=true
```

### 6) Keep secrets safe

- Never commit `.env`, `credentials.json`, or `token.json`.
- Rotate/revoke OAuth credentials if compromised.
- Use read-only Gmail scope where possible (`gmail.readonly`).

## CI Behavior (Current)

- Smoke workflow: `.github/workflows/playwright.yml`
  - Trigger: pull request + manual run
  - Test selection: `@smoke` (Gmail excluded)
  - Output: merged HTML report artifact `playwright-report-smoke`
- Sanity workflow: `.github/workflows/playwright-sanity.yml`
  - Trigger: push to main/master + manual run
  - Test selection: `@sanity` (Gmail excluded)
  - Output: merged HTML report artifact `playwright-report-sanity`
- Regression workflow: `.github/workflows/playwright-nightly.yml`
  - Trigger: schedule + manual run
  - Test selection: `@regression` (Gmail included when `RUN_GMAIL_E2E=true`)
  - Required secrets for Gmail mode:
    - `FORGOT_PASSWORD_EMAIL` (optional; defaults to `GMAIL_EMAIL` if missing)
    - `GMAIL_CREDENTIALS_JSON` (raw `credentials.json`)
    - `GMAIL_TOKEN_JSON` (raw `token.json` with refresh token)
  - Output: merged HTML report artifact `playwright-report-regression`
- Blob artifacts are internal merge inputs for sharded runs and kept short-lived.

## Reports and Debugging

After test execution:

- HTML report: `playwright-report/`
- Runtime artifacts: `test-results/`

Open report:

```bash
npx playwright show-report
```

Useful debugging mode:

```bash
PWDEBUG=1 npx playwright test tests/auth/login.spec.ts --headed
```

## Common Troubleshooting

- **Error: `LOGIN_EMAIL and LOGIN_PASSWORD must be defined`**
  - Add both values to `.env`.
- **Gmail link not found / email polling timeout**
  - Confirm the app sends mail to the expected test inbox.
  - Ensure `credentials.json` and valid `token.json` exist.
  - Revoke and regenerate token if OAuth refresh fails.
- **Unexpected selector failures**
  - UI may have changed; update selectors in page objects under `pages/`.
- **Authenticated tests fail after setup**
  - Ensure `tests/setup/auth.setup.ts` can log in and create `playwright/.auth/user.json`.

## Security Notes

- This repository is suitable for public sharing only when secrets remain outside source control.
- Keep all credentials in local `.env` and local OAuth files.
- Do not embed secrets in tests, fixtures, or workflow files.

## License

ISC (as defined in `package.json`).
