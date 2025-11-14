import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, serverError } from "@/lib/api-response"

// GET all forms for a user
export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from session once auth is implemented
    const userId = "demo-user"

    const forms = await prisma.form.findMany({
      where: { userId },
      include: {
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return successResponse(forms)
  } catch (error) {
    console.error("Error fetching forms:", error)
    return serverError(error)
  }
}

// POST create a new form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return errorResponse("Form title is required", 400)
    }

    // TODO: Get userId from session once auth is implemented
    const userId = "demo-user"

    const form = await prisma.form.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        userId,
      },
    })

    return successResponse(form, 201)
  } catch (error) {
    console.error("Error creating form:", error)
    return serverError(error)
  }
}
