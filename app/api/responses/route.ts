import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, serverError } from "@/lib/api-response"
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit"
import { sanitizeInput, sanitizeEmail, sanitizeUrl, sanitizePhone } from "@/lib/sanitize"
import { validateRequest, formResponseSchema } from "@/lib/validation"
import { logRequest, logResponse, logError, logSecurityEvent } from "@/lib/logger"
import { FieldType } from "@prisma/client"

// POST submit a form response
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  try {
    logRequest('POST', '/api/responses', ip)

    // Strict rate limiting for form submissions (prevent spam)
    const rateLimitResult = await checkRateLimit(request, 'form-submission')
    if (!rateLimitResult.success) {
      logSecurityEvent('Rate limit exceeded - Form submission', { ip, retryAfter: rateLimitResult.retryAfter })
      return createRateLimitResponse(rateLimitResult.retryAfter!)
    }

    const body = await request.json()

    // Validate request body with Zod
    const validationResult = validateRequest(formResponseSchema, body)
    if (!validationResult.success) {
      return errorResponse(validationResult.error, 400)
    }

    const { formId, fieldResponses, submitterEmail, metadata } = validationResult.data

    // Check if form exists and is published
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        settings: true,
      },
    })

    if (!form) {
      return errorResponse("Form not found", 404)
    }

    if (!form.isPublished) {
      logSecurityEvent('Attempted submission to unpublished form', { formId, ip })
      return errorResponse("This form is not accepting responses", 403)
    }

    // Check if multiple submissions are allowed
    if (!form.settings?.allowMultipleSubmissions) {
      // Check for duplicate submissions from same IP in last 24 hours
      const recentSubmission = await prisma.formResponse.findFirst({
        where: {
          formId,
          submitterIp: ip,
          submittedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      })

      if (recentSubmission) {
        logSecurityEvent('Duplicate submission blocked', { formId, ip })
        return errorResponse(
          "You have already submitted this form. Multiple submissions are not allowed.",
          429
        )
      }
    }

    // Validate required fields
    const requiredFields = form.fields.filter(f => f.required)
    const responseFieldIds = new Set(fieldResponses.map((fr) => fr.fieldId))

    for (const field of requiredFields) {
      if (!responseFieldIds.has(field.id)) {
        return errorResponse(`Required field "${field.label}" is missing`, 400)
      }
    }

    // Validate and sanitize email if provided
    let sanitizedEmail: string | null = null
    if (submitterEmail) {
      sanitizedEmail = sanitizeEmail(submitterEmail)
      if (!sanitizedEmail) {
        return errorResponse("Invalid email address", 400)
      }
    }

    // Validate and sanitize each field response based on field type
    const sanitizedFieldResponses: Array<{ fieldId: string; value: any }> = []

    for (const fieldResponse of fieldResponses) {
      const field = form.fields.find(f => f.id === fieldResponse.fieldId)

      if (!field) {
        return errorResponse(`Invalid field ID: ${fieldResponse.fieldId}`, 400)
      }

      let sanitizedValue: any = fieldResponse.value

      // Type-specific validation and sanitization
      switch (field.type) {
        case FieldType.SHORT_TEXT:
        case FieldType.LONG_TEXT:
          if (typeof sanitizedValue !== 'string') {
            return errorResponse(`Field "${field.label}" must be text`, 400)
          }
          sanitizedValue = sanitizeInput(sanitizedValue)
          if (sanitizedValue.length > 10000) {
            return errorResponse(`Field "${field.label}" is too long (max 10000 characters)`, 400)
          }
          break

        case FieldType.EMAIL:
          if (typeof sanitizedValue !== 'string') {
            return errorResponse(`Field "${field.label}" must be an email`, 400)
          }
          sanitizedValue = sanitizeEmail(sanitizedValue)
          if (!sanitizedValue) {
            return errorResponse(`Invalid email in field "${field.label}"`, 400)
          }
          break

        case FieldType.URL:
          if (typeof sanitizedValue !== 'string') {
            return errorResponse(`Field "${field.label}" must be a URL`, 400)
          }
          sanitizedValue = sanitizeUrl(sanitizedValue)
          if (!sanitizedValue) {
            return errorResponse(`Invalid URL in field "${field.label}"`, 400)
          }
          break

        case FieldType.PHONE:
          if (typeof sanitizedValue !== 'string') {
            return errorResponse(`Field "${field.label}" must be a phone number`, 400)
          }
          sanitizedValue = sanitizePhone(sanitizedValue)
          break

        case FieldType.NUMBER:
        case FieldType.LINEAR_SCALE:
          const num = Number(sanitizedValue)
          if (isNaN(num)) {
            return errorResponse(`Field "${field.label}" must be a number`, 400)
          }
          sanitizedValue = num
          break

        case FieldType.MULTIPLE_CHOICE:
        case FieldType.DROPDOWN:
          if (typeof sanitizedValue !== 'string') {
            return errorResponse(`Field "${field.label}" must be a string`, 400)
          }
          sanitizedValue = sanitizeInput(sanitizedValue)
          // Validate against allowed options if provided
          const options = field.options as any
          if (options?.choices && Array.isArray(options.choices)) {
            const validChoice = options.choices.some((choice: string) => choice === sanitizedValue)
            if (!validChoice) {
              return errorResponse(`Invalid choice for field "${field.label}"`, 400)
            }
          }
          break

        case FieldType.CHECKBOXES:
          if (!Array.isArray(sanitizedValue)) {
            return errorResponse(`Field "${field.label}" must be an array`, 400)
          }
          sanitizedValue = sanitizedValue.map((v: any) =>
            typeof v === 'string' ? sanitizeInput(v) : v
          )
          if (sanitizedValue.length > 50) {
            return errorResponse(`Too many checkboxes selected for "${field.label}" (max 50)`, 400)
          }
          break

        case FieldType.DATE:
        case FieldType.TIME:
          // Validate date/time format
          if (typeof sanitizedValue !== 'string') {
            return errorResponse(`Field "${field.label}" must be a date/time string`, 400)
          }
          sanitizedValue = sanitizeInput(sanitizedValue)
          break

        case FieldType.FILE_UPLOAD:
          // File uploads should contain URL or file ID
          if (typeof sanitizedValue !== 'string') {
            return errorResponse(`Field "${field.label}" must be a file reference`, 400)
          }
          sanitizedValue = sanitizeInput(sanitizedValue)
          break

        default:
          // Sanitize as text for unknown types
          if (typeof sanitizedValue === 'string') {
            sanitizedValue = sanitizeInput(sanitizedValue)
          }
      }

      sanitizedFieldResponses.push({
        fieldId: field.id,
        value: sanitizedValue,
      })
    }

    // Check for suspicious patterns (potential spam)
    const responseText = sanitizedFieldResponses
      .map(fr => String(fr.value))
      .join(' ')
      .toLowerCase()

    const spamPatterns = [
      /viagra|cialis|pharmacy/i,
      /click here|buy now/i,
      /(https?:\/\/){3,}/i, // Multiple URLs
      /\b(casino|poker|lottery)\b/i,
    ]

    const isSuspicious = spamPatterns.some(pattern => pattern.test(responseText))

    if (isSuspicious) {
      logSecurityEvent('Suspicious form submission detected', {
        formId,
        ip,
        patterns: 'spam_keywords',
      })
      // Still allow submission but flag it
    }

    // Get user agent and metadata
    const userAgent = request.headers.get("user-agent") || "unknown"
    const sanitizedMetadata = {
      userAgent,
      timestamp: new Date().toISOString(),
      flagged: isSuspicious,
      ...metadata,
    }

    // Create response in database
    const response = await prisma.formResponse.create({
      data: {
        formId,
        submitterEmail: sanitizedEmail,
        submitterIp: ip,
        metadata: sanitizedMetadata,
        fieldResponses: {
          create: sanitizedFieldResponses,
        },
      },
      select: {
        id: true,
        submittedAt: true,
        fieldResponses: {
          select: {
            id: true,
            fieldId: true,
            value: true,
          },
        },
      },
    })

    logResponse('POST', '/api/responses', 201, Date.now() - startTime)

    return successResponse({
      id: response.id,
      submittedAt: response.submittedAt,
      message: "Form submitted successfully",
    }, 201)
  } catch (error) {
    logError(error, { method: 'POST', url: '/api/responses', ip })
    console.error("Error submitting response:", error)
    return serverError(error)
  }
}
