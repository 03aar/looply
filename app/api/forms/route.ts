import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    return NextResponse.json(forms)
  } catch (error) {
    console.error("Error fetching forms:", error)
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
  }
}

// POST create a new form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description } = body

    // TODO: Get userId from session once auth is implemented
    const userId = "demo-user"

    const form = await prisma.form.create({
      data: {
        title: title || "Untitled Form",
        description,
        userId,
      },
    })

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 })
  }
}
