"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldType, type FormField } from "@/types/form"
import FieldSelector from "./FieldSelector"
import FieldEditor from "./FieldEditor"
import { GripVertical, Trash2 } from "lucide-react"

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: getDefaultLabel(type),
      required: false,
      order: fields.length,
      options: type === FieldType.MULTIPLE_CHOICE ||
               type === FieldType.CHECKBOXES ||
               type === FieldType.DROPDOWN
        ? [
            { id: '1', label: 'Option 1', value: 'option-1' },
            { id: '2', label: 'Option 2', value: 'option-2' },
          ]
        : undefined,
    }
    setFields([...fields, newField])
    setSelectedFieldId(newField.id)
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
    if (selectedFieldId === id) {
      setSelectedFieldId(null)
    }
  }

  const getDefaultLabel = (type: FieldType): string => {
    const labels: Record<FieldType, string> = {
      [FieldType.SHORT_TEXT]: "Short Answer",
      [FieldType.LONG_TEXT]: "Long Answer",
      [FieldType.EMAIL]: "Email Address",
      [FieldType.NUMBER]: "Number",
      [FieldType.PHONE]: "Phone Number",
      [FieldType.URL]: "Website URL",
      [FieldType.DATE]: "Date",
      [FieldType.TIME]: "Time",
      [FieldType.MULTIPLE_CHOICE]: "Multiple Choice",
      [FieldType.CHECKBOXES]: "Checkboxes",
      [FieldType.DROPDOWN]: "Dropdown",
      [FieldType.LINEAR_SCALE]: "Linear Scale",
      [FieldType.FILE_UPLOAD]: "File Upload",
      [FieldType.SECTION_HEADER]: "Section Header",
    }
    return labels[type]
  }

  const selectedField = fields.find(f => f.id === selectedFieldId)

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Fields</h2>

        {fields.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No fields yet. Add your first field to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <Card
                key={field.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFieldId === field.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedFieldId(field.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button className="mt-1 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{field.label}</h3>
                          {field.description && (
                            <p className="text-sm text-gray-500 mt-1">{field.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteField(field.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {field.type.replace(/_/g, ' ')}
                      </span>
                      {field.required && (
                        <span className="text-xs text-red-500 ml-2">Required</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <FieldSelector onSelectField={addField} />
      </div>

      <div className="lg:sticky lg:top-24 h-fit">
        {selectedField ? (
          <FieldEditor
            field={selectedField}
            onUpdate={(updates) => updateField(selectedField.id, updates)}
          />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Select a field to edit its properties</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
