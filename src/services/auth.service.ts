import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { setToken } from '@/utils/token'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'TESTER' | 'VIEWER'
}

/**
 * Hook to login the user
 * Accepts a callback `onSuccess(user)` that you can use in LoginForm to redirect
 */
export const useAuthLogin = (onSuccess?: (user: any) => void) =>
  useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post('/auth/login', data)
      const { token, user } = res.data

      // Save token and user info
      setToken(token)
      localStorage.setItem('user', JSON.stringify(user))

      return res.data
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data.user)
    }
  })

/**
 * Hook to register a new user
 */
export const useAuthRegister = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await api.post('/auth/register', data)
      return response.data
    },
    onSuccess
  })
