import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const body = await request.json()
    const { isPublished } = body

    const form = await prisma.form.update({
      where: { id: params.formId },
      data: { isPublished },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error publishing form:", error)
    return NextResponse.json({ error: "Failed to publish form" }, { status: 500 })
  }
}
