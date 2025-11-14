"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Eye, Copy, Trash2 } from "lucide-react"

export default function Dashboard() {
  const [forms, setForms] = useState([
    {
      id: "1",
      title: "Sample Contact Form",
      description: "Get in touch with us",
      responses: 24,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Event Registration",
      description: "Register for our upcoming event",
      responses: 156,
      isPublished: true,
      createdAt: new Date(),
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Forms
            </h1>
            <p className="text-gray-600 mt-2">Create and manage your beautiful forms</p>
          </div>
          <Link href="/dashboard/forms/new">
            <Button className="gap-2">
              <PlusCircle className="w-5 h-5" />
              Create New Form
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="group hover:shadow-xl transition-all animate-slide-up">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{form.title}</CardTitle>
                    <CardDescription>{form.description}</CardDescription>
                  </div>
                  {form.isPublished && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Published
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <FileText className="w-4 h-4" />
                  <span>{form.responses} responses</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/forms/${form.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/forms/${form.id}/responses`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty state or create new card */}
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
      </div>
    </div>
  )
}
