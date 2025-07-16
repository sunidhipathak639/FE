import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { setToken } from '@/utils/token'

/**
 * Login payload type
 */
interface LoginPayload {
  email: string
  password: string
}

/**
 * Register payload type
 */
interface RegisterPayload {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'TESTER' | 'VIEWER'
}

/**
 * Hook for user login
 */
export const useAuthLogin = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await api.post('/auth/login', data)
      setToken(response.data.token)
      return response.data
    },
    onSuccess
  })

/**
 * Hook for user registration
 */
export const useAuthRegister = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await api.post('/auth/register', data)
      return response.data
    },
    onSuccess
  })
