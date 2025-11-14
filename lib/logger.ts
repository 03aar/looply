import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

/**
 * Production-grade logging system with file rotation
 */

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
)

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`
    }
    return msg
  })
)

// Create transports array
const transports: winston.transport[] = []

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    format: consoleFormat,
  })
)

// File transports (only in production or if LOG_TO_FILE is set)
if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true') {
  // Error logs
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d', // Keep for 14 days
      format: logFormat,
    })
  )

  // Combined logs
  transports.push(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d', // Keep for 7 days
      format: logFormat,
    })
  )
}

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
})

// Handle uncaught exceptions and rejections
if (process.env.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    })
  )

  logger.rejections.handle(
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    })
  )
}

/**
 * Log API request
 */
export function logRequest(method: string, url: string, ip: string, userId?: string) {
  logger.info('API Request', {
    method,
    url,
    ip,
    userId,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Log API response
 */
export function logResponse(
  method: string,
  url: string,
  status: number,
  duration: number
) {
  logger.info('API Response', {
    method,
    url,
    status,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Log error with context
 */
export function logError(
  error: Error | unknown,
  context?: Record<string, any>
) {
  if (error instanceof Error) {
    logger.error(error.message, {
      stack: error.stack,
      ...context,
      timestamp: new Date().toISOString(),
    })
  } else {
    logger.error('Unknown error', {
      error: String(error),
      ...context,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Log security event (rate limiting, failed auth, etc.)
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any>
) {
  logger.warn(`Security Event: ${event}`, {
    ...details,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Log database query performance
 */
export function logQuery(query: string, duration: number) {
  if (duration > 1000) {
    // Log slow queries (> 1 second)
    logger.warn('Slow Query', {
      query,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  }
}

export default logger
