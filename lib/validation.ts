import { z } from 'zod'
import { FieldType } from '@prisma/client'

/**
 * Form creation/update validation schema
 */
export const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  isPublished: z.boolean().optional(),
})

/**
 * Form field validation schema
 */
export const formFieldSchema = z.object({
  type: z.nativeEnum(FieldType),
  label: z.string().min(1, 'Label is required').max(200, 'Label too long'),
  description: z.string().max(500, 'Description too long').optional(),
  placeholder: z.string().max(200, 'Placeholder too long').optional(),
  required: z.boolean().optional(),
  order: z.number().int().min(0),
  options: z.any().optional(), // JSON field
  validation: z.any().optional(), // JSON field
  conditional: z.any().optional(), // JSON field
})

/**
 * Form fields array validation
 */
export const formFieldsArraySchema = z.array(formFieldSchema).max(100, 'Too many fields (max 100)')

/**
 * Form response validation schema
 */
export const formResponseSchema = z.object({
  formId: z.string().cuid(),
  submitterEmail: z.string().email().optional(),
  fieldResponses: z.array(
    z.object({
      fieldId: z.string().cuid(),
      value: z.any(), // Can be string, number, array, etc.
    })
  ).min(1, 'At least one field response required').max(100),
  metadata: z.any().optional(),
})

/**
 * Pagination query parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

/**
 * Query parameter for form ID
 */
export const formIdParamSchema = z.object({
  formId: z.string().cuid('Invalid form ID'),
})

/**
 * Query parameter for share ID
 */
export const shareIdParamSchema = z.object({
  shareId: z.string().cuid('Invalid share ID'),
})

/**
 * Email validation
 */
export const emailSchema = z.string().email('Invalid email address')

/**
 * URL validation
 */
export const urlSchema = z.string().url('Invalid URL')

/**
 * Phone validation (flexible)
 */
export const phoneSchema = z.string().regex(
  /^[\d+\s()-]+$/,
  'Invalid phone number format'
)

/**
 * Publish form schema
 */
export const publishFormSchema = z.object({
  isPublished: z.boolean(),
})

/**
 * Helper function to validate request body
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data)
    return { success: true, data: parsed }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return {
        success: false,
        error: `${firstError.path.join('.')}: ${firstError.message}`,
      }
    }
    return { success: false, error: 'Invalid request data' }
  }
}

/**
 * Validate pagination parameters from URL search params
 */
export function validatePagination(searchParams: URLSearchParams) {
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '10'

  return validateRequest(paginationSchema, { page, limit })
}
