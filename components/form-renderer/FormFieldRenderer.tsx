"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldType, type FormField } from "@/types/form"

interface FormFieldRendererProps {
  field: FormField
  value: any
  onChange: (value: any) => void
}

export default function FormFieldRenderer({ field, value, onChange }: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case FieldType.SHORT_TEXT:
      case FieldType.EMAIL:
      case FieldType.PHONE:
      case FieldType.URL:
        return (
          <Input
            type={field.type === FieldType.EMAIL ? "email" : field.type === FieldType.URL ? "url" : "text"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
            required={field.required}
            className="text-lg py-6"
          />
        )

      case FieldType.LONG_TEXT:
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
            required={field.required}
            rows={6}
            className="text-lg"
          />
        )

      case FieldType.NUMBER:
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || "Enter a number"}
            required={field.required}
            className="text-lg py-6"
          />
        )

      case FieldType.DATE:
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="text-lg py-6"
          />
        )

      case FieldType.TIME:
        return (
          <Input
            type="time"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="text-lg py-6"
          />
        )

      case FieldType.MULTIPLE_CHOICE:
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <motion.label
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  value === option.value
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-lg">{option.label}</span>
              </motion.label>
            ))}
          </div>
        )

      case FieldType.CHECKBOXES:
        const checkboxValues = value || []
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <motion.label
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  checkboxValues.includes(option.value)
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checkboxValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...checkboxValues, option.value]
                      : checkboxValues.filter((v: string) => v !== option.value)
                    onChange(newValues)
                  }}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-lg">{option.label}</span>
              </motion.label>
            ))}
          </div>
        )

      case FieldType.DROPDOWN:
        return (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case FieldType.LINEAR_SCALE:
        const min = field.validation?.min || 1
        const max = field.validation?.max || 5
        const scaleValues = Array.from({ length: max - min + 1 }, (_, i) => min + i)
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-2">
              {scaleValues.map((scaleValue, index) => (
                <motion.button
                  key={scaleValue}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  type="button"
                  onClick={() => onChange(scaleValue)}
                  className={`flex-1 aspect-square max-w-[80px] rounded-lg border-2 text-xl font-semibold transition-all ${
                    value === scaleValue
                      ? "border-purple-500 bg-purple-500 text-white shadow-lg scale-110"
                      : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                  }`}
                >
                  {scaleValue}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{min} - Poor</span>
              <span>{max} - Excellent</span>
            </div>
          </div>
        )

      case FieldType.FILE_UPLOAD:
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-all">
            <Input
              type="file"
              onChange={(e) => onChange(e.target.files?.[0])}
              required={field.required}
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-2">
              {value ? value.name : "Click to upload or drag and drop"}
            </p>
          </div>
        )

      case FieldType.SECTION_HEADER:
        return (
          <div className="text-center py-4">
            <h2 className="text-3xl font-bold text-gray-800">{field.label}</h2>
            {field.description && (
              <p className="text-gray-600 mt-2">{field.description}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {field.type !== FieldType.SECTION_HEADER && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-gray-600 mb-4">{field.description}</p>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {renderField()}
      </motion.div>
    </div>
  )
}
