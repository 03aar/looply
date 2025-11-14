import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error fetching form:", error)
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 })
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

    // Update form basic info
    const form = await prisma.form.update({
      where: { id: params.formId },
      data: {
        title,
        description,
        isPublished,
      },
    })

    // Update or create fields
    if (fields) {
      // Delete existing fields
      await prisma.formField.deleteMany({
        where: { formId: params.formId },
      })

      // Create new fields
      await prisma.formField.createMany({
        data: fields.map((field: any, index: number) => ({
          formId: params.formId,
          type: field.type,
          label: field.label,
          description: field.description,
          placeholder: field.placeholder,
          required: field.required,
          order: index,
          options: field.options || undefined,
          validation: field.validation || undefined,
          conditional: field.conditional || undefined,
        })),
      })
    }

    // Update or create settings
    if (settings) {
      await prisma.formSettings.upsert({
        where: { formId: params.formId },
        create: {
          formId: params.formId,
          ...settings,
        },
        update: settings,
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

    return NextResponse.json(updatedForm)
  } catch (error) {
    console.error("Error updating form:", error)
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 })
  }
}

// DELETE a form
export async function DELETE(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    await prisma.form.delete({
      where: { id: params.formId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting form:", error)
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 })
  }
}
