"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FieldType } from "@/types/form"
import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  Phone,
  Link as LinkIcon,
  Calendar,
  Clock,
  Circle,
  CheckSquare,
  ChevronDown,
  BarChart3,
  Upload,
  Heading,
} from "lucide-react"

interface FieldSelectorProps {
  onSelectField: (type: FieldType) => void
}

export default function FieldSelector({ onSelectField }: FieldSelectorProps) {
  const fieldTypes = [
    { type: FieldType.SHORT_TEXT, icon: Type, label: "Short Text", description: "Single line text", example: "Name, job title" },
    { type: FieldType.LONG_TEXT, icon: AlignLeft, label: "Long Text", description: "Multi-line text", example: "Comments, feedback" },
    { type: FieldType.EMAIL, icon: Mail, label: "Email", description: "Email address", example: "user@example.com" },
    { type: FieldType.NUMBER, icon: Hash, label: "Number", description: "Numeric input", example: "Age, quantity" },
    { type: FieldType.PHONE, icon: Phone, label: "Phone", description: "Phone number", example: "+1 234 567 8900" },
    { type: FieldType.URL, icon: LinkIcon, label: "URL", description: "Website link", example: "https://..." },
    { type: FieldType.DATE, icon: Calendar, label: "Date", description: "Date picker", example: "Birthday, deadline" },
    { type: FieldType.TIME, icon: Clock, label: "Time", description: "Time picker", example: "Meeting time" },
    { type: FieldType.MULTIPLE_CHOICE, icon: Circle, label: "Multiple Choice", description: "Pick one option", example: "Yes/No questions" },
    { type: FieldType.CHECKBOXES, icon: CheckSquare, label: "Checkboxes", description: "Pick multiple", example: "Select interests" },
    { type: FieldType.DROPDOWN, icon: ChevronDown, label: "Dropdown", description: "Select menu", example: "Choose country" },
    { type: FieldType.LINEAR_SCALE, icon: BarChart3, label: "Linear Scale", description: "Rating 1-5", example: "Satisfaction level" },
    { type: FieldType.FILE_UPLOAD, icon: Upload, label: "File Upload", description: "Attach files", example: "Resume, photos" },
    { type: FieldType.SECTION_HEADER, icon: Heading, label: "Section Header", description: "Organize form", example: "Personal Info" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Add Field</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Click any field type to add it to your form</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {fieldTypes.map(({ type, icon: Icon, label, description, example }) => (
            <Button
              key={type}
              variant="outline"
              className="h-auto flex-col items-start p-3 hover:bg-purple-50 hover:border-purple-300 transition-all group"
              onClick={() => onSelectField(type)}
              title={`${label} - ${example}`}
            >
              <Icon className="w-5 h-5 mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">{label}</span>
              <span className="text-xs text-gray-500">{description}</span>
            </Button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="font-medium mb-1">💡 Tip:</p>
          <p>Start with a Short Text field for name, then add Email if you need to contact respondents.</p>
        </div>
      </CardContent>
    </Card>
  )
}
