// src/lib/axios.ts

import axios from 'axios'
import { getToken } from '@/utils/token' // ✅ this uses the alias @ = src

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
