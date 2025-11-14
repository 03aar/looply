export enum FieldType {
  SHORT_TEXT = 'SHORT_TEXT',
  LONG_TEXT = 'LONG_TEXT',
  EMAIL = 'EMAIL',
  NUMBER = 'NUMBER',
  PHONE = 'PHONE',
  URL = 'URL',
  DATE = 'DATE',
  TIME = 'TIME',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOXES = 'CHECKBOXES',
  DROPDOWN = 'DROPDOWN',
  LINEAR_SCALE = 'LINEAR_SCALE',
  FILE_UPLOAD = 'FILE_UPLOAD',
  SECTION_HEADER = 'SECTION_HEADER',
}

export interface FormFieldOption {
  id: string
  label: string
  value: string
}

export interface FormFieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  customErrorMessage?: string
}

export interface ConditionalLogic {
  fieldId: string
  condition: 'equals' | 'contains' | 'greaterThan' | 'lessThan'
  value: any
  action: 'show' | 'hide' | 'jump'
  targetFieldId?: string
}

export interface FormField {
  id: string
  formId?: string
  type: FieldType
  label: string
  description?: string
  placeholder?: string
  required: boolean
  order: number
  options?: FormFieldOption[]
  validation?: FormFieldValidation
  conditional?: ConditionalLogic[]
}

export interface FormSettings {
  allowMultipleSubmissions: boolean
  requireLogin: boolean
  showProgressBar: boolean
  customTheme?: {
    primaryColor?: string
    backgroundColor?: string
    fontFamily?: string
  }
  confirmationMessage?: string
  redirectUrl?: string
  collectEmail: boolean
}

export interface Form {
  id: string
  title: string
  description?: string
  userId: string
  fields: FormField[]
  settings?: FormSettings
  isPublished: boolean
  shareId: string
  createdAt: Date
  updatedAt: Date
}

export interface FormResponse {
  id: string
  formId: string
  fieldResponses: {
    fieldId: string
    value: any
  }[]
  submittedAt: Date
  submitterEmail?: string
}
