"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FieldType, type FormField, type Form } from "@/types/form"
import FormFieldRenderer from "./FormFieldRenderer"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"

interface FormRendererProps {
  form: Form
  onSubmit: (responses: Record<string, any>) => void
}

export default function FormRenderer({ form, onSubmit }: FormRendererProps) {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [direction, setDirection] = useState(1)

  const currentField = form.fields[currentFieldIndex]
  const isLastField = currentFieldIndex === form.fields.length - 1
  const isFirstField = currentFieldIndex === 0

  const handleNext = () => {
    if (!isLastField) {
      setDirection(1)
      setCurrentFieldIndex(currentFieldIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstField) {
      setDirection(-1)
      setCurrentFieldIndex(currentFieldIndex - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(responses)
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses({ ...responses, [fieldId]: value })
  }

  const canProceed = () => {
    if (!currentField.required) return true
    const value = responses[currentField.id]
    return value !== undefined && value !== null && value !== ""
  }

  const progress = ((currentFieldIndex + 1) / form.fields.length) * 100

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        {form.settings?.showProgressBar !== false && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="mb-8"
          >
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Question {currentFieldIndex + 1} of {form.fields.length}
            </p>
          </motion.div>
        )}

        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </motion.div>

        {/* Form Field */}
        <Card className="p-8 shadow-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentFieldIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <FormFieldRenderer
                field={currentField}
                value={responses[currentField.id]}
                onChange={(value) => handleFieldChange(currentField.id, value)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstField}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {!isLastField ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2 ml-auto"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="gap-2 ml-auto bg-green-600 hover:bg-green-700"
              >
                Submit
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-purple-600">looply</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
