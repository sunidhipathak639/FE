import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'

interface TaskPayload {
  title: string
  description?: string
}

export const useCreateTask = () =>
  useMutation({
    mutationFn: async (data: TaskPayload) => {
      const res = await api.post('/tasks', data)
      return res.data
    }
  })
