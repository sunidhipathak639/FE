import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// ✅ Fetch all tasks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/tasks`)
      return response.data
    }
  })
}

// ✅ Create a new task
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskData: { title: string; description?: string }) => {
      const response = await axios.post(`${API_URL}/tasks`, taskData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }) // Refresh task list
    }
  })
}
