import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, serverError } from "@/lib/api-response"
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit"
import { sanitizeInput } from "@/lib/sanitize"
import { validateRequest, formSchema, validatePagination } from "@/lib/validation"
import { logRequest, logResponse, logError } from "@/lib/logger"

// GET all forms for a user with pagination
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  try {
    logRequest('GET', '/api/forms', ip)

    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'api')
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult.retryAfter!)
    }

    // Validate pagination parameters
    const searchParams = request.nextUrl.searchParams
    const paginationResult = validatePagination(searchParams)

    if (!paginationResult.success) {
      return errorResponse(paginationResult.error, 400)
    }

    const { page, limit } = paginationResult.data

    // TODO: Get userId from session once auth is implemented
    const userId = "demo-user"

    // Optimized query with pagination and selected fields only
    const [forms, totalCount] = await Promise.all([
      prisma.form.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          description: true,
          isPublished: true,
          shareId: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              responses: true,
              fields: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.form.count({
        where: { userId },
      }),
    ])

    const response = {
      forms,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
      },
    }

    logResponse('GET', '/api/forms', 200, Date.now() - startTime)
    return successResponse(response)
  } catch (error) {
    logError(error, { method: 'GET', url: '/api/forms', ip })
    console.error("Error fetching forms:", error)
    return serverError(error)
  }
}

// POST create a new form
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  try {
    logRequest('POST', '/api/forms', ip)

    // Rate limiting for form creation (stricter)
    const rateLimitResult = await checkRateLimit(request, 'form-creation')
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult.retryAfter!)
    }

    const body = await request.json()

    // Validate request body
    const validationResult = validateRequest(formSchema, body)
    if (!validationResult.success) {
      return errorResponse(validationResult.error, 400)
    }

    const { title, description } = validationResult.data

    // Sanitize inputs to prevent XSS
    const sanitizedTitle = sanitizeInput(title)
    const sanitizedDescription = description ? sanitizeInput(description) : null

    if (sanitizedTitle.length === 0) {
      return errorResponse("Form title cannot be empty after sanitization", 400)
    }

    // TODO: Get userId from session once auth is implemented
    const userId = "demo-user"

    // Check user's form quota (prevent spam)
    const userFormCount = await prisma.form.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    })

    if (userFormCount >= 50) {
      return errorResponse(
        "You have reached the maximum number of forms (50) in 24 hours. Please try again later.",
        429
      )
    }

    const form = await prisma.form.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        shareId: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    logResponse('POST', '/api/forms', 201, Date.now() - startTime)
    return successResponse(form, 201)
  } catch (error) {
    logError(error, { method: 'POST', url: '/api/forms', ip })
    console.error("Error creating form:", error)
    return serverError(error)
  }
}
