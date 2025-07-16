import api from '@/lib/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Task {
  id: string
  title: string
  description?: string
}

export const useGetTasks = () =>
  useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks')
      return res.data
    }
  })

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Task, 'id'>) => {
      const res = await api.post('/tasks', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }) // refresh task list
    }
  })
}
