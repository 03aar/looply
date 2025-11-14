"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Users, Calendar, MessageSquare, Clipboard, Star, Heart } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const templates = [
  {
    id: "contact",
    icon: MessageSquare,
    title: "Contact Form",
    description: "Simple contact form with name, email, and message",
    color: "bg-blue-100 text-blue-600",
    fields: [
      { type: "SHORT_TEXT", label: "Full Name", required: true },
      { type: "EMAIL", label: "Email Address", required: true },
      { type: "PHONE", label: "Phone Number", required: false },
      { type: "LONG_TEXT", label: "Message", required: true, placeholder: "How can we help you?" }
    ]
  },
  {
    id: "event",
    icon: Calendar,
    title: "Event Registration",
    description: "Collect registrations for your event",
    color: "bg-purple-100 text-purple-600",
    fields: [
      { type: "SHORT_TEXT", label: "Full Name", required: true },
      { type: "EMAIL", label: "Email Address", required: true },
      { type: "PHONE", label: "Phone Number", required: false },
      { type: "MULTIPLE_CHOICE", label: "How did you hear about us?", required: false, options: [
        { id: '1', label: 'Social Media', value: 'social-media' },
        { id: '2', label: 'Friend', value: 'friend' },
        { id: '3', label: 'Website', value: 'website' },
        { id: '4', label: 'Other', value: 'other' }
      ]},
      { type: "LONG_TEXT", label: "Any special requests or dietary restrictions?", required: false }
    ]
  },
  {
    id: "feedback",
    icon: Star,
    title: "Customer Feedback",
    description: "Gather feedback from your customers",
    color: "bg-yellow-100 text-yellow-600",
    fields: [
      { type: "SHORT_TEXT", label: "Name", required: false },
      { type: "EMAIL", label: "Email", required: false },
      { type: "LINEAR_SCALE", label: "How satisfied are you with our service?", required: true, validation: { min: 1, max: 5 } },
      { type: "MULTIPLE_CHOICE", label: "Would you recommend us to others?", required: true, options: [
        { id: '1', label: 'Definitely', value: 'definitely' },
        { id: '2', label: 'Probably', value: 'probably' },
        { id: '3', label: 'Not Sure', value: 'not-sure' },
        { id: '4', label: 'Probably Not', value: 'probably-not' }
      ]},
      { type: "LONG_TEXT", label: "What can we improve?", required: false }
    ]
  },
  {
    id: "survey",
    icon: Clipboard,
    title: "Survey Template",
    description: "Basic survey with multiple question types",
    color: "bg-green-100 text-green-600",
    fields: [
      { type: "SECTION_HEADER", label: "About You", description: "Tell us a little about yourself" },
      { type: "SHORT_TEXT", label: "Name", required: false },
      { type: "EMAIL", label: "Email", required: false },
      { type: "SECTION_HEADER", label: "Your Feedback", description: "We value your opinion" },
      { type: "LINEAR_SCALE", label: "Rate your experience", required: true, validation: { min: 1, max: 5 } },
      { type: "CHECKBOXES", label: "What did you like?", required: false, options: [
        { id: '1', label: 'Easy to use', value: 'easy' },
        { id: '2', label: 'Fast', value: 'fast' },
        { id: '3', label: 'Beautiful design', value: 'design' },
        { id: '4', label: 'Helpful', value: 'helpful' }
      ]}
    ]
  },
  {
    id: "rsvp",
    icon: Users,
    title: "RSVP Form",
    description: "Event RSVP with attendance confirmation",
    color: "bg-pink-100 text-pink-600",
    fields: [
      { type: "SHORT_TEXT", label: "Full Name", required: true },
      { type: "EMAIL", label: "Email Address", required: true },
      { type: "MULTIPLE_CHOICE", label: "Will you attend?", required: true, options: [
        { id: '1', label: 'Yes, I will attend', value: 'yes' },
        { id: '2', label: 'No, I cannot attend', value: 'no' },
        { id: '3', label: 'Maybe', value: 'maybe' }
      ]},
      { type: "NUMBER", label: "Number of guests", required: false, placeholder: "Including yourself" },
      { type: "LONG_TEXT", label: "Any comments or questions?", required: false }
    ]
  },
  {
    id: "application",
    icon: FileText,
    title: "Job Application",
    description: "Simple job application form",
    color: "bg-indigo-100 text-indigo-600",
    fields: [
      { type: "SECTION_HEADER", label: "Personal Information" },
      { type: "SHORT_TEXT", label: "Full Name", required: true },
      { type: "EMAIL", label: "Email Address", required: true },
      { type: "PHONE", label: "Phone Number", required: true },
      { type: "SECTION_HEADER", label: "Application Details" },
      { type: "SHORT_TEXT", label: "Position Applied For", required: true },
      { type: "FILE_UPLOAD", label: "Upload Resume", required: true },
      { type: "LONG_TEXT", label: "Why do you want to work with us?", required: true }
    ]
  },
  {
    id: "newsletter",
    icon: Heart,
    title: "Newsletter Signup",
    description: "Collect email subscribers",
    color: "bg-red-100 text-red-600",
    fields: [
      { type: "SHORT_TEXT", label: "First Name", required: true },
      { type: "EMAIL", label: "Email Address", required: true },
      { type: "CHECKBOXES", label: "What are you interested in?", required: false, options: [
        { id: '1', label: 'Product Updates', value: 'products' },
        { id: '2', label: 'Company News', value: 'news' },
        { id: '3', label: 'Tips & Tricks', value: 'tips' },
        { id: '4', label: 'Special Offers', value: 'offers' }
      ]}
    ]
  },
  {
    id: "blank",
    icon: FileText,
    title: "Start from Scratch",
    description: "Create a completely custom form",
    color: "bg-gray-100 text-gray-600",
    fields: []
  }
]

export default function TemplatesPage() {
  const router = useRouter()
  const [creating, setCreating] = useState<string | null>(null)

  const useTemplate = async (template: typeof templates[0]) => {
    try {
      setCreating(template.id)

      // Create form with template
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create form")
      }

      const { data: form } = await response.json()

      // If template has fields, add them
      if (template.fields.length > 0) {
        await fetch(`/api/forms/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: template.title,
            description: template.description,
            fields: template.fields.map((field, index) => ({
              ...field,
              id: `field-${Date.now()}-${index}`,
              order: index
            })),
          }),
        })
      }

      // Redirect to form editor
      router.push(`/dashboard/forms/new?id=${form.id}`)
    } catch (err) {
      alert("Failed to create form from template. Please try again.")
    } finally {
      setCreating(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Form Templates
            </h1>
            <p className="text-gray-600 mt-2">Start with a pre-built template or create from scratch</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => {
            const Icon = template.icon
            const isCreating = creating === template.id

            return (
              <Card
                key={template.id}
                className="hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => !isCreating && useTemplate(template)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${template.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{template.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full group-hover:bg-purple-700 transition-colors"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Use Template"}
                  </Button>
                  {template.fields.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {template.fields.length} fields included
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
          <Link href="/dashboard/forms/new">
            <Button variant="outline" size="lg">
              Start from Scratch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
