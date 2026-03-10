/**
 * Generates a random password with uppercase, lowercase, numbers, and special characters
 * @param length - Length of the password (default: 12)
 * @param options - Password generation options
 * @returns A random password string
 */
export function generatePassword(
  length: number = 12,
  options: {
    includeUppercase?: boolean
    includeLowercase?: boolean
    includeNumbers?: boolean
    includeSpecial?: boolean
  } = {}
): string {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = true
  } = options

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123'
  const special = '@'

  let charPool = ''
  const requiredChars: string[] = []

  if (includeUppercase) {
    charPool += uppercase
    requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)])
  }
  if (includeLowercase) {
    charPool += lowercase
    requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)])
  }
  if (includeNumbers) {
    charPool += numbers
    requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)])
  }
  if (includeSpecial) {
    charPool += special
    requiredChars.push(special[Math.floor(Math.random() * special.length)])
  }

  if (!charPool) {
    throw new Error('At least one character type must be enabled')
  }

  // Fill remaining length with random characters
  let password = requiredChars.slice()
  while (password.length < length) {
    password.push(charPool[Math.floor(Math.random() * charPool.length)])
  }

  // Shuffle the password array
  password = password.sort(() => Math.random() - 0.5)

  return password.join('')
}

/**
 * Generates a strong password following common security standards
 * Format: Uppercase + lowercase + numbers + special char (e.g., "Tr7@kLmNoPq")
 * @returns A random strong password
 */
export function generateStrongPassword(): string {
  return generatePassword(12, {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true
  })
}

/**
 * Generates a random phone number starting with "50" followed by 7 random digits
 * Format: 50XXXXXXX (e.g., 501234567)
 * @returns A random phone number string
 */
export function generateRandomEmail(baseEmail: string): string {
  const [localPartWithAlias, domain] = baseEmail.split('@')
  if (!localPartWithAlias || !domain) {
    throw new Error(`Invalid base email provided for alias generation: ${baseEmail}`)
  }

  // If base email already has +alias, keep only root local-part
  const localPart = localPartWithAlias.split('+')[0]
  const randomNum = `${Date.now()}${Math.floor(Math.random() * 1000)}`
  return `${localPart}+${randomNum}@${domain}`
}

export function generateRandomPhoneNumber(): string {
  const randomDigits = Math.floor(Math.random() * 10000000).toString().padStart(7, '0')
  return `50${randomDigits}`
}
