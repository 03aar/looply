import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all responses for a form
export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
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

    return NextResponse.json(responses)
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }
}
