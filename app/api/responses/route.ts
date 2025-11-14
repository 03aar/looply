import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, serverError } from "@/lib/api-response"

// POST submit a form response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formId, fieldResponses, submitterEmail } = body

    // Validation
    if (!formId || typeof formId !== 'string') {
      return errorResponse("formId is required", 400)
    }

    if (!fieldResponses || !Array.isArray(fieldResponses)) {
      return errorResponse("fieldResponses must be an array", 400)
    }

    // Check if form exists and is published
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: true,
        settings: true,
      },
    })

    if (!form) {
      return errorResponse("Form not found", 404)
    }

    if (!form.isPublished) {
      return errorResponse("This form is not accepting responses", 403)
    }

    // Validate required fields
    const requiredFields = form.fields.filter(f => f.required)
    const responseFieldIds = new Set(fieldResponses.map((fr: any) => fr.fieldId))

    for (const field of requiredFields) {
      if (!responseFieldIds.has(field.id)) {
        return errorResponse(`Required field "${field.label}" is missing`, 400)
      }
    }

    // Validate email if required
    if (form.settings?.collectEmail && submitterEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(submitterEmail)) {
        return errorResponse("Invalid email address", 400)
      }
    }

    // Create response
    const response = await prisma.formResponse.create({
      data: {
        formId,
        submitterEmail: submitterEmail || null,
        submitterIp: request.headers.get("x-forwarded-for") || "unknown",
        metadata: {
          userAgent: request.headers.get("user-agent"),
          timestamp: new Date().toISOString(),
        },
        fieldResponses: {
          create: fieldResponses.map((fr: any) => ({
            fieldId: fr.fieldId,
            value: fr.value,
          })),
        },
      },
      include: {
        fieldResponses: true,
      },
    })

    return successResponse(response, 201)
  } catch (error) {
    console.error("Error submitting response:", error)
    return serverError(error)
  }
}
