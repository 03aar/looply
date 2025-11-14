import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundError, serverError } from "@/lib/api-response"

// GET form by share ID (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: { shareId: params.shareId },
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

    if (!form.isPublished) {
      return errorResponse("This form is not currently accepting responses", 403)
    }

    return successResponse(form)
  } catch (error) {
    console.error("Error fetching form:", error)
    return serverError(error)
  }
}
