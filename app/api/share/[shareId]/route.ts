import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (!form.isPublished) {
      return NextResponse.json({ error: "Form is not published" }, { status: 403 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error fetching form:", error)
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 })
  }
}
