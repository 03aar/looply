import { NextResponse } from "next/server"

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status: number = 500, details?: any) {
  console.error(`API Error: ${message}`, details)
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && details ? { details } : {})
    },
    { status }
  )
}

export function validationError(message: string, errors?: any) {
  return errorResponse(message, 400, errors)
}

export function notFoundError(resource: string = "Resource") {
  return errorResponse(`${resource} not found`, 404)
}

export function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal server error"
  return errorResponse(message, 500, error)
}
