"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import FormBuilder from "@/components/form-builder/FormBuilder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Send, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { FormField } from "@/types/form"

export default function NewFormPage() {
  const router = useRouter()
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [savedFormId, setSavedFormId] = useState<string | null>(null)

  const handleFieldsChange = useCallback((updatedFields: FormField[]) => {
    setFields(updatedFields)
  }, [])

  const handleSave = async (shouldPublish = false) => {
    try {
      setSaving(true)
      setPublishing(shouldPublish)
      setError(null)
      setSuccess(null)

      if (!formTitle.trim()) {
        setError("Form title is required")
        return
      }

      if (fields.length === 0) {
        setError("Please add at least one field to your form")
        return
      }

      let formId = savedFormId

      if (!formId) {
        // Create form
        const createResponse = await fetch("/api/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            description: formDescription,
          }),
        })

        if (!createResponse.ok) {
          const error = await createResponse.json()
          throw new Error(error.error || "Failed to create form")
        }

        const { data: form } = await createResponse.json()
        formId = form.id
        setSavedFormId(formId)
      }

      // Update form with fields
      const updateResponse = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          fields: fields,
        }),
      })

      if (!updateResponse.ok) {
        const error = await updateResponse.json()
        throw new Error(error.error || "Failed to save form")
      }

      // Publish if requested
      if (shouldPublish) {
        const publishResponse = await fetch(`/api/forms/${formId}/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: true }),
        })

        if (!publishResponse.ok) {
          const error = await publishResponse.json()
          throw new Error(error.error || "Failed to publish form")
        }

        setSuccess("Form published successfully! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 2000)
      } else {
        setSuccess("Form saved as draft!")
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to save form")
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{formTitle}</h1>
                <p className="text-sm text-gray-500">Form Builder</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleSave(false)}
                disabled={saving || publishing}
                variant="outline"
                className="gap-2"
              >
                {saving && !publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Draft
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={saving || publishing}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish Form
                  </>
                )}
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Form Title</label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter form title"
                  className="text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Add a description for your form"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <FormBuilder fields={fields} onFieldsChange={handleFieldsChange} />
        </div>
      </div>
    </div>
  )
}
