import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios' // Assuming axios instance is set up here

// ✅ Fetch all tasks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/tasks') // Make API call using custom axios instance
      return response.data
    },
    onError: (error) => {
      console.error('Error fetching tasks:', error)
    }
  })
};
export const useAssignedTasks = () => {
  return useQuery({
    queryKey: ['assignedTasks'],
    queryFn: async () => {
      const response = await api.get('/tasks/assigned');
      return response.data; // { total, page, limit, data: [...] }
    },
    onError: (error) => {
      console.error('Error fetching assigned tasks:', error);
    }
  });
};

// ✅ Assign task to a user
export const useAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      assignedToId,
    }: {
      taskId: string;
      assignedToId: string;
    }) => {
      const response = await api.put(`/tasks/${taskId}/assign`, {
        assignedToId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Error assigning task:', error);
    },
  });
};


// ✅ Create a new task
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskData: { title: string; description?: string }) => {
      const response = await api.post('/tasks', taskData) // No need for `API_URL`, use `api`
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }) // Refresh task list
    },
    onError: (error) => {
      console.error('Error creating task:', error)
    }
  })
}

// ✅ Update a task (optional for your app)
export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, taskData }: { id: string; taskData: any }) => {
      const response = await api.put(`/tasks/${id}`, taskData) // Update task
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }) // Refresh task list after mutation
    },
    onError: (error) => {
      console.error('Error updating task:', error)
    }
  })
}

// ✅ Delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/tasks/${id}`) // Delete task
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }) // Refresh task list after deletion
    },
    onError: (error) => {
      console.error('Error deleting task:', error)
    }
  })
}
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status
    }: {
      id: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    }) => {
      const response = await api.patch(`/tasks/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      console.error('Error updating task status:', error)
    }
  })
}