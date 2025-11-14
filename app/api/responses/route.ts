import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST submit a form response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formId, fieldResponses, submitterEmail } = body

    // Create response
    const response = await prisma.formResponse.create({
      data: {
        formId,
        submitterEmail,
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

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error submitting response:", error)
    return NextResponse.json({ error: "Failed to submit response" }, { status: 500 })
  }
}
