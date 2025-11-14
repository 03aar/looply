// Environment variable validation and utilities

export function getEnvVar(key: string, required: boolean = false): string | undefined {
  const value = process.env[key]

  if (required && !value) {
    console.warn(`Warning: Required environment variable ${key} is not set`)
  }

  return value
}

export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

export const env = {
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL'),
  NODE_ENV: process.env.NODE_ENV || 'development',
}
