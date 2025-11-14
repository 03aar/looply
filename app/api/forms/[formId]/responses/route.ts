import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundError, serverError } from "@/lib/api-response"

// GET all responses for a form
export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    // Check if form exists
    const form = await prisma.form.findUnique({
      where: { id: params.formId },
    })

    if (!form) {
      return notFoundError("Form")
    }

    const responses = await prisma.formResponse.findMany({
      where: { formId: params.formId },
      include: {
        fieldResponses: {
          include: {
            field: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    })

    return successResponse(responses)
  } catch (error) {
    console.error("Error fetching responses:", error)
    return serverError(error)
  }
}
