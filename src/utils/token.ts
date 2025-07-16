// ✅ Correct
import { jwtDecode } from 'jwt-decode'



const TOKEN_KEY = 'token'

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

interface DecodedUser {
  id: string
  email: string
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'TESTER' | 'VIEWER'
  name?: string
  exp: number
  iat: number
}

export const getUserFromToken = (): DecodedUser | null => {
  const token = getToken()
  if (!token) return null

  try {
    const decoded = jwtDecode<DecodedUser>(token)
    return decoded
  } catch (error) {
    console.error('Failed to decode token', error)
    return null
  }
}
