import { NextRequest } from 'next/server'
import { successResponse, errorResponse, serverError } from '@/lib/api-response'
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limit'
import { getFormAnalytics, getFieldResponseRates, exportAnalyticsData } from '@/lib/analytics'
import { logRequest, logResponse, logError } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

// GET form analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  try {
    logRequest('GET', `/api/forms/${params.formId}/analytics`, ip)

    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'api')
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult.retryAfter!)
    }

    const formId = params.formId

    // Verify form exists and user has access
    // TODO: Check user ownership when auth is implemented
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { id: true, userId: true, title: true },
    })

    if (!form) {
      return errorResponse('Form not found', 404)
    }

    // Check export parameter
    const searchParams = request.nextUrl.searchParams
    const exportData = searchParams.get('export') === 'true'
    const includeFieldRates = searchParams.get('fieldRates') === 'true'

    let data

    if (exportData) {
      data = await exportAnalyticsData(formId)
    } else {
      data = await getFormAnalytics(formId)

      if (includeFieldRates) {
        const fieldRates = await getFieldResponseRates(formId)
        data = { ...data, fieldAnalytics: fieldRates }
      }
    }

    logResponse('GET', `/api/forms/${params.formId}/analytics`, 200, Date.now() - startTime)

    return successResponse(data)
  } catch (error) {
    logError(error, { method: 'GET', url: `/api/forms/${params.formId}/analytics`, ip })
    console.error('Error fetching analytics:', error)
    return serverError(error)
  }
}
