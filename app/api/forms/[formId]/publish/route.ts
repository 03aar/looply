import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundError, serverError } from "@/lib/api-response"

export async function POST(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const body = await request.json()
    const { isPublished } = body

    if (typeof isPublished !== 'boolean') {
      return errorResponse("isPublished must be a boolean", 400)
    }

    // Check if form exists
    const existingForm = await prisma.form.findUnique({
      where: { id: params.formId },
      include: {
        fields: true,
      },
    })

    if (!existingForm) {
      return notFoundError("Form")
    }

    // Validate that form has at least one field before publishing
    if (isPublished && existingForm.fields.length === 0) {
      return errorResponse("Cannot publish a form without any fields", 400)
    }

    const form = await prisma.form.update({
      where: { id: params.formId },
      data: { isPublished },
    })

    return successResponse(form)
  } catch (error) {
    console.error("Error publishing form:", error)
    return serverError(error)
  }
}
