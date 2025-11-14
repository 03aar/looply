"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/lib/utils"
import { LoadingPage } from "@/components/loading"

export default function ResponsesPage() {
  const params = useParams()
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/forms/${params.formId}/responses`)

      if (!response.ok) {
        throw new Error("Failed to fetch responses")
      }

      const result = await response.json()
      setResponses(result.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load responses")
    } finally {
      setLoading(false)
    }
  }, [params.formId])

  useEffect(() => {
    fetchResponses()
  }, [fetchResponses])

  const exportToCSV = () => {
    if (responses.length === 0) return

    // Get all field names
    const fields = responses[0].fieldResponses.map((fr: any) => fr.field.label)
    const headers = ["Submitted At", "Email", ...fields]

    // Build CSV content
    const rows = responses.map(response => {
      const row = [
        formatDateTime(new Date(response.submittedAt)),
        response.submitterEmail || "N/A",
        ...response.fieldResponses.map((fr: any) => {
          const value = fr.value
          if (Array.isArray(value)) return value.join(", ")
          if (typeof value === "object") return JSON.stringify(value)
          return value
        }),
      ]
      return row.map(cell => `"${cell}"`).join(",")
    })

    const csv = [headers.join(","), ...rows].join("\n")

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `responses-${params.formId}.csv`
    a.click()
  }

  if (loading) {
    return <LoadingPage message="Loading responses..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Form Responses</h1>
              <p className="text-gray-600 mt-1">{responses.length} total responses</p>
            </div>
          </div>
          <Button onClick={exportToCSV} disabled={responses.length === 0} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
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

        {responses.length === 0 && !error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No responses yet</h3>
              <p className="text-gray-500">Share your form to start collecting responses</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <Card key={response.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Response #{response.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDateTime(new Date(response.submittedAt))}
                        {response.submitterEmail && ` • ${response.submitterEmail}`}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {response.fieldResponses.map((fr: any) => (
                      <div key={fr.id}>
                        <h4 className="font-medium text-gray-700 mb-1">{fr.field.label}</h4>
                        <p className="text-gray-600">
                          {Array.isArray(fr.value)
                            ? fr.value.join(", ")
                            : typeof fr.value === "object"
                            ? JSON.stringify(fr.value)
                            : fr.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
