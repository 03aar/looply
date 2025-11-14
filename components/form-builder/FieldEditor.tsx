"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FieldType, type FormField, type FormFieldOption } from "@/types/form"
import { Plus, X } from "lucide-react"

interface FieldEditorProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
}

export default function FieldEditor({ field, onUpdate }: FieldEditorProps) {
  const hasOptions = [
    FieldType.MULTIPLE_CHOICE,
    FieldType.CHECKBOXES,
    FieldType.DROPDOWN,
  ].includes(field.type)

  const addOption = () => {
    const newOption: FormFieldOption = {
      id: `option-${Date.now()}`,
      label: `Option ${(field.options?.length || 0) + 1}`,
      value: `option-${Date.now()}`,
    }
    onUpdate({
      options: [...(field.options || []), newOption],
    })
  }

  const updateOption = (optionId: string, label: string) => {
    onUpdate({
      options: field.options?.map(opt =>
        opt.id === optionId ? { ...opt, label, value: label.toLowerCase().replace(/\s+/g, '-') } : opt
      ),
    })
  }

  const deleteOption = (optionId: string) => {
    onUpdate({
      options: field.options?.filter(opt => opt.id !== optionId),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Field Label</label>
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Enter field label"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
          <Textarea
            value={field.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Add a description"
            rows={2}
          />
        </div>

        {field.type !== FieldType.SECTION_HEADER && (
          <div>
            <label className="text-sm font-medium mb-2 block">Placeholder (Optional)</label>
            <Input
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />
          </div>
        )}

        {hasOptions && (
          <div>
            <label className="text-sm font-medium mb-2 block">Options</label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteOption(option.id)}
                    disabled={(field.options?.length || 0) <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addOption}
                className="w-full"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {field.type === FieldType.LINEAR_SCALE && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Scale Range</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={field.validation?.min || 1}
                  onChange={(e) => onUpdate({
                    validation: { ...field.validation, min: parseInt(e.target.value) }
                  })}
                  className="w-20"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={field.validation?.max || 5}
                  onChange={(e) => onUpdate({
                    validation: { ...field.validation, max: parseInt(e.target.value) }
                  })}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t">
          <input
            type="checkbox"
            id="required"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="required" className="text-sm font-medium cursor-pointer">
            Required field
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
