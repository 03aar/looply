import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundError, serverError } from "@/lib/api-response"

// GET a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: params.formId },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
        settings: true,
      },
    })

    if (!form) {
      return notFoundError("Form")
    }

    return successResponse(form)
  } catch (error) {
    console.error("Error fetching form:", error)
    return serverError(error)
  }
}

// PUT update a form
export async function PUT(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const body = await request.json()
    const { title, description, fields, settings, isPublished } = body

    if (title && (typeof title !== 'string' || title.trim().length === 0)) {
      return errorResponse("Form title cannot be empty", 400)
    }

    // Check if form exists
    const existingForm = await prisma.form.findUnique({
      where: { id: params.formId },
    })

    if (!existingForm) {
      return notFoundError("Form")
    }

    // Update form basic info
    await prisma.form.update({
      where: { id: params.formId },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isPublished !== undefined && { isPublished }),
      },
    })

    // Update fields if provided
    if (fields && Array.isArray(fields)) {
      // Delete existing fields
      await prisma.formField.deleteMany({
        where: { formId: params.formId },
      })

      // Create new fields
      if (fields.length > 0) {
        await prisma.formField.createMany({
          data: fields.map((field: any, index: number) => ({
            formId: params.formId,
            type: field.type,
            label: field.label,
            description: field.description || null,
            placeholder: field.placeholder || null,
            required: field.required ?? false,
            order: index,
            options: field.options ? JSON.parse(JSON.stringify(field.options)) : null,
            validation: field.validation ? JSON.parse(JSON.stringify(field.validation)) : null,
            conditional: field.conditional ? JSON.parse(JSON.stringify(field.conditional)) : null,
          })),
        })
      }
    }

    // Update or create settings
    if (settings) {
      await prisma.formSettings.upsert({
        where: { formId: params.formId },
        create: {
          formId: params.formId,
          allowMultipleSubmissions: settings.allowMultipleSubmissions ?? true,
          requireLogin: settings.requireLogin ?? false,
          showProgressBar: settings.showProgressBar ?? true,
          customTheme: settings.customTheme ? JSON.parse(JSON.stringify(settings.customTheme)) : null,
          confirmationMessage: settings.confirmationMessage || null,
          redirectUrl: settings.redirectUrl || null,
          collectEmail: settings.collectEmail ?? true,
        },
        update: {
          ...(settings.allowMultipleSubmissions !== undefined && { allowMultipleSubmissions: settings.allowMultipleSubmissions }),
          ...(settings.requireLogin !== undefined && { requireLogin: settings.requireLogin }),
          ...(settings.showProgressBar !== undefined && { showProgressBar: settings.showProgressBar }),
          ...(settings.customTheme !== undefined && { customTheme: settings.customTheme ? JSON.parse(JSON.stringify(settings.customTheme)) : null }),
          ...(settings.confirmationMessage !== undefined && { confirmationMessage: settings.confirmationMessage || null }),
          ...(settings.redirectUrl !== undefined && { redirectUrl: settings.redirectUrl || null }),
          ...(settings.collectEmail !== undefined && { collectEmail: settings.collectEmail }),
        },
      })
    }

    // Fetch updated form
    const updatedForm = await prisma.form.findUnique({
      where: { id: params.formId },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
        settings: true,
      },
    })

    return successResponse(updatedForm)
  } catch (error) {
    console.error("Error updating form:", error)
    return serverError(error)
  }
}

// DELETE a form
export async function DELETE(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    // Check if form exists
    const existingForm = await prisma.form.findUnique({
      where: { id: params.formId },
    })

    if (!existingForm) {
      return notFoundError("Form")
    }

    await prisma.form.delete({
      where: { id: params.formId },
    })

    return successResponse({ deleted: true })
  } catch (error) {
    console.error("Error deleting form:", error)
    return serverError(error)
  }
}
