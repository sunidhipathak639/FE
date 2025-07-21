import api from '../lib/axios'

export const createComment = async (data: {
  content: string
  taskId: string
  authorId: string
}) => {
  const response = await api.put('/comments', data)
  return response.data
}

export const getComments = async () => {
  const response = await api.get('/comments')
  return response.data
}
