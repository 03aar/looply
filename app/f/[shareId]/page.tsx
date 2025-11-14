"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import FormRenderer from "@/components/form-renderer/FormRenderer"
import { type Form } from "@/types/form"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"
import { LoadingPage } from "@/components/loading"

export default function PublicFormPage() {
  const params = useParams()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchForm = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/share/${params.shareId}`)

      if (!response.ok) {
        throw new Error("Form not found")
      }

      const result = await response.json()
      setForm(result.data)
    } catch (err: any) {
      setError(err.message || "This form could not be found or is no longer available.")
    } finally {
      setLoading(false)
    }
  }, [params.shareId])

  useEffect(() => {
    fetchForm()
  }, [fetchForm])

  const handleSubmit = async (responses: Record<string, any>) => {
    try {
      setSubmitting(true)
      const fieldResponses = Object.entries(responses).map(([fieldId, value]) => ({
        fieldId,
        value,
      }))

      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form?.id,
          fieldResponses,
          submitterEmail: responses.email,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to submit response")
      }

      setSubmitted(true)
    } catch (err: any) {
      alert(err.message || "Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingPage message="Loading form..." />
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Form Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-8">
            {form.settings?.confirmationMessage || "Your response has been recorded."}
          </p>
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-purple-600">looply</span>
          </p>
        </motion.div>
      </div>
    )
  }

  return <FormRenderer form={form} onSubmit={handleSubmit} />
}
