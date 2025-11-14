import { RateLimiterMemory } from 'rate-limiter-flexible'
import { NextRequest } from 'next/server'

// Rate limiters for different endpoints
const apiLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds (1 minute)
})

const formSubmissionLimiter = new RateLimiterMemory({
  points: 10, // 10 submissions
  duration: 60, // Per minute
})

const formCreationLimiter = new RateLimiterMemory({
  points: 5, // 5 forms
  duration: 60, // Per minute
})

const strictLimiter = new RateLimiterMemory({
  points: 20, // 20 requests
  duration: 60, // Per minute
})

export type RateLimitType = 'api' | 'form-submission' | 'form-creation' | 'strict'

/**
 * Get client IP address from request
 */
function getClientIp(req: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfConnectingIp = req.headers.get('cf-connecting-ip') // Cloudflare

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  return 'unknown'
}

/**
 * Rate limit middleware for API routes
 * @param req - Next.js request object
 * @param type - Type of rate limit to apply
 * @returns null if allowed, error response if rate limited
 */
export async function checkRateLimit(
  req: NextRequest,
  type: RateLimitType = 'api'
): Promise<{ success: boolean; error?: string; retryAfter?: number }> {
  const ip = getClientIp(req)
  const key = `${type}:${ip}`

  let limiter: RateLimiterMemory

  switch (type) {
    case 'form-submission':
      limiter = formSubmissionLimiter
      break
    case 'form-creation':
      limiter = formCreationLimiter
      break
    case 'strict':
      limiter = strictLimiter
      break
    default:
      limiter = apiLimiter
  }

  try {
    await limiter.consume(key)
    return { success: true }
  } catch (rateLimiterRes: any) {
    const retryAfter = Math.ceil(rateLimiterRes.msBeforeNext / 1000)
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter,
    }
  }
}

/**
 * Helper to create rate limit response
 */
export function createRateLimitResponse(retryAfter: number) {
  return Response.json(
    {
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + retryAfter * 1000).toISOString(),
      },
    }
  )
}
