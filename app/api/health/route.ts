import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Health check endpoint for monitoring
 * Returns system status and database connectivity
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    const dbResponseTime = Date.now() - startTime

    // Get some basic stats
    const [formsCount, responsesCount] = await Promise.all([
      prisma.form.count(),
      prisma.formResponse.count(),
    ])

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'connected',
        responseTime: `${dbResponseTime}ms`,
      },
      stats: {
        totalForms: formsCount,
        totalResponses: responsesCount,
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Health check failed:', error)

    return Response.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      database: {
        status: 'disconnected',
      },
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  }
}
