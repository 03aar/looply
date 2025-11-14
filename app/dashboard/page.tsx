"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Eye, Copy, Trash2, Share2, AlertCircle, Star } from "lucide-react"
import { LoadingPage } from "@/components/loading"
import { formatDateTime } from "@/lib/utils"

interface Form {
  id: string
  title: string
  description: string | null
  isPublished: boolean
  shareId: string
  createdAt: string
  _count?: {
    responses: number
  }
}

export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/forms")

      if (!response.ok) {
        throw new Error("Failed to fetch forms")
      }

      const result = await response.json()
      setForms(result.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load forms")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchForms()
  }, [fetchForms])

  const handleDelete = async (formId: string) => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete form")
      }

      // Refresh the forms list
      fetchForms()
    } catch (err: any) {
      alert(err.message || "Failed to delete form")
    }
  }

  const handleCopyLink = (shareId: string) => {
    const link = `${window.location.origin}/f/${shareId}`
    navigator.clipboard.writeText(link)
    alert("Form link copied to clipboard!")
  }

  if (loading) {
    return <LoadingPage message="Loading your forms..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Forms
            </h1>
            <p className="text-gray-600 mt-2">Create and manage your beautiful forms</p>
          </div>
          <div className="flex gap-2">
            <Link href="/templates">
              <Button variant="outline" className="gap-2">
                <FileText className="w-5 h-5" />
                Browse Templates
              </Button>
            </Link>
            <Link href="/dashboard/forms/new">
              <Button className="gap-2">
                <PlusCircle className="w-5 h-5" />
                Create New Form
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="group hover:shadow-xl transition-all animate-slide-up">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{form.title}</CardTitle>
                    <CardDescription>{form.description || "No description"}</CardDescription>
                  </div>
                  {form.isPublished ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full whitespace-nowrap">
                      Draft
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <FileText className="w-4 h-4" />
                  <span>{form._count?.responses || 0} responses</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link href={`/dashboard/forms/${form.id}/responses`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </Link>
                  {form.isPublished && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(form.shareId)}
                      title="Copy form link"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(form.id)}
                    title="Delete form"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create new card */}
          <Link href="/dashboard/forms/new">
            <Card className="border-dashed border-2 hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer h-full min-h-[200px] flex items-center justify-center">
              <CardContent className="text-center">
                <PlusCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">Create New Form</p>
                <p className="text-sm text-gray-500 mt-2">Start building your form</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {forms.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Looply!</h3>
              <p className="text-gray-500 mb-6">
                Create your first form in just 2 minutes. Choose a template to get started quickly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/templates">
                  <Button size="lg" className="gap-2">
                    <Star className="w-5 h-5" />
                    Browse Templates
                  </Button>
                </Link>
                <Link href="/dashboard/forms/new">
                  <Button size="lg" variant="outline" className="gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Start from Scratch
                  </Button>
                </Link>
              </div>
              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Quick Tips:</h4>
                <ul className="text-sm text-purple-700 space-y-1 text-left">
                  <li>• Use templates to save time</li>
                  <li>• Drag fields to reorder them</li>
                  <li>• Mark important fields as required</li>
                  <li>• Share your form link to collect responses</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
