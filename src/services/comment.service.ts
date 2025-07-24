import api from '../lib/axios'

// Create a new comment
export const createComment = async (data: {
  content: string
  taskId: string
}) => {
  const response = await api.post('/comments', data) // use POST, not PUT
  return response.data
}

// Get all comments (admin-wide use)
export const getAllComments = async () => {
  const response = await api.get('/comments')
  return response.data
}

// Get comments for a specific task
export const getCommentsByTask = async (taskId: string) => {
  const response = await api.get(`/comments/task/${taskId}`);
  return response.data;
};

// Optional: Delete a comment
export const deleteComment = async (id: string) => {
  const response = await api.delete(`/comments/${id}`)
  return response.data
}

// Optional: Update a comment
export const updateComment = async (id: string, content: string) => {
  const response = await api.put(`/comments/${id}`, { content })
  return response.data
}
