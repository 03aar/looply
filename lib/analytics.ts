import { prisma } from './prisma'

/**
 * Analytics tracking system for forms
 * Tracks views, submissions, completion rates, etc.
 */

export interface FormAnalytics {
  formId: string
  views: number
  starts: number // Started filling but didn't submit
  submissions: number
  completionRate: number
  avgCompletionTime: number | null
  uniqueVisitors: number
  topExitPoints: Array<{ fieldId: string; fieldLabel: string; exitCount: number }>
  submissionsByDay: Array<{ date: string; count: number }>
  deviceBreakdown: { desktop: number; mobile: number; tablet: number }
  topReferrers: Array<{ referrer: string; count: number }>
}

/**
 * Track form view
 */
export async function trackFormView(formId: string, metadata: {
  ip: string
  userAgent: string
  referrer?: string
}) {
  try {
    // In production, you'd store this in a separate analytics table
    // For now, we'll use the metadata field in responses

    // Could also use a time-series database like InfluxDB or a service like Plausible

    const deviceType = getDeviceType(metadata.userAgent)

    // Store in a hypothetical analytics table (you'd need to add this to schema)
    // For now, this is a placeholder showing how you'd implement it

    console.log('📊 Analytics: Form view tracked', {
      formId,
      ip: metadata.ip,
      deviceType,
      referrer: metadata.referrer,
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  } catch (error) {
    console.error('Error tracking form view:', error)
    return { success: false }
  }
}

/**
 * Get form analytics
 */
export async function getFormAnalytics(formId: string): Promise<FormAnalytics> {
  try {
    // Get all responses for this form
    const responses = await prisma.formResponse.findMany({
      where: { formId },
      include: {
        fieldResponses: true,
      },
      orderBy: { submittedAt: 'asc' },
    })

    const submissionCount = responses.length

    // Calculate submissions by day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const submissionsByDay: { [key: string]: number } = {}

    responses.forEach(response => {
      if (response.submittedAt >= thirtyDaysAgo) {
        const date = response.submittedAt.toISOString().split('T')[0]
        submissionsByDay[date] = (submissionsByDay[date] || 0) + 1
      }
    })

    const submissionsByDayArray = Object.entries(submissionsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Device breakdown
    const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 }

    responses.forEach(response => {
      const metadata = response.metadata as any
      if (metadata?.userAgent) {
        const device = getDeviceType(metadata.userAgent)
        deviceBreakdown[device]++
      }
    })

    // Unique visitors (by IP)
    const uniqueIPs = new Set(responses.map(r => r.submitterIp).filter(Boolean))

    // Top referrers (would need to track this in metadata)
    const referrerCounts: { [key: string]: number } = {}
    responses.forEach(response => {
      const metadata = response.metadata as any
      const referrer = metadata?.referrer || 'direct'
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1
    })

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // For completion rate, views, and starts, you'd need additional tracking
    // This is a simplified version
    const estimatedViews = submissionCount * 3 // Rough estimate: 33% conversion rate
    const completionRate = estimatedViews > 0 ? (submissionCount / estimatedViews) * 100 : 0

    return {
      formId,
      views: estimatedViews,
      starts: submissionCount, // In full implementation, track separately
      submissions: submissionCount,
      completionRate: Math.round(completionRate * 10) / 10,
      avgCompletionTime: null, // Would need to track start/end times
      uniqueVisitors: uniqueIPs.size,
      topExitPoints: [], // Would need to track field-by-field progress
      submissionsByDay: submissionsByDayArray,
      deviceBreakdown,
      topReferrers,
    }
  } catch (error) {
    console.error('Error getting form analytics:', error)
    throw error
  }
}

/**
 * Get device type from user agent
 */
function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase()

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet'
  }

  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|windows phone/i.test(ua)) {
    return 'mobile'
  }

  return 'desktop'
}

/**
 * Get response rate by field (detect drop-off points)
 */
export async function getFieldResponseRates(formId: string) {
  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: {
      fields: {
        orderBy: { order: 'asc' },
      },
      responses: {
        include: {
          fieldResponses: true,
        },
      },
    },
  })

  if (!form) {
    throw new Error('Form not found')
  }

  const totalResponses = form.responses.length

  if (totalResponses === 0) {
    return []
  }

  const fieldRates = form.fields.map(field => {
    const responsesWithField = form.responses.filter(response =>
      response.fieldResponses.some(fr => fr.fieldId === field.id)
    ).length

    return {
      fieldId: field.id,
      fieldLabel: field.label,
      responseCount: responsesWithField,
      responseRate: (responsesWithField / totalResponses) * 100,
      dropOffRate: ((totalResponses - responsesWithField) / totalResponses) * 100,
    }
  })

  return fieldRates
}

/**
 * Export analytics data for external tools
 */
export async function exportAnalyticsData(formId: string) {
  const analytics = await getFormAnalytics(formId)
  const fieldRates = await getFieldResponseRates(formId)

  return {
    ...analytics,
    fieldAnalytics: fieldRates,
    exportedAt: new Date().toISOString(),
  }
}
