import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
// import { setToken } from '@/utils/token' // 👈 keep this for future use

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
 * Hook for user login
 * Saves user object in localStorage and redirects based on role
 */
export const useAuthLogin = (onSuccess?: (user: any) => void) =>
  useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post('/auth/login', data)
      const { user } = res.data

      // setToken(res.data.token) // 👈 Enable when backend sends a token
      localStorage.setItem('user', JSON.stringify(user))

      return res.data
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data.user)
    }
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
