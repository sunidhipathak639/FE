import { z } from 'zod'

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'TESTER', 'VIEWER'], {
    errorMap: () => ({ message: 'Select a role' })
  })
})
