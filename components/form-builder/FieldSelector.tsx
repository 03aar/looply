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
    { type: FieldType.SHORT_TEXT, icon: Type, label: "Short Text", description: "Single line text" },
    { type: FieldType.LONG_TEXT, icon: AlignLeft, label: "Long Text", description: "Multi-line text" },
    { type: FieldType.EMAIL, icon: Mail, label: "Email", description: "Email address" },
    { type: FieldType.NUMBER, icon: Hash, label: "Number", description: "Numeric input" },
    { type: FieldType.PHONE, icon: Phone, label: "Phone", description: "Phone number" },
    { type: FieldType.URL, icon: LinkIcon, label: "URL", description: "Website link" },
    { type: FieldType.DATE, icon: Calendar, label: "Date", description: "Date picker" },
    { type: FieldType.TIME, icon: Clock, label: "Time", description: "Time picker" },
    { type: FieldType.MULTIPLE_CHOICE, icon: Circle, label: "Multiple Choice", description: "Radio buttons" },
    { type: FieldType.CHECKBOXES, icon: CheckSquare, label: "Checkboxes", description: "Multiple selections" },
    { type: FieldType.DROPDOWN, icon: ChevronDown, label: "Dropdown", description: "Select menu" },
    { type: FieldType.LINEAR_SCALE, icon: BarChart3, label: "Linear Scale", description: "Rating scale" },
    { type: FieldType.FILE_UPLOAD, icon: Upload, label: "File Upload", description: "File attachment" },
    { type: FieldType.SECTION_HEADER, icon: Heading, label: "Section Header", description: "Heading/divider" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Field</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {fieldTypes.map(({ type, icon: Icon, label, description }) => (
            <Button
              key={type}
              variant="outline"
              className="h-auto flex-col items-start p-3 hover:bg-purple-50 hover:border-purple-300 transition-all"
              onClick={() => onSelectField(type)}
            >
              <Icon className="w-5 h-5 mb-2 text-purple-600" />
              <span className="font-medium text-sm">{label}</span>
              <span className="text-xs text-gray-500">{description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
