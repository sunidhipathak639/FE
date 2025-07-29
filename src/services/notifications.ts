import api from '../lib/axios'

// Create a new comment
export const createComment = async (data: {
  content: string
  taskId: string
}) => {
  const response = await api.post('/comments', data) // use POST, not PUT
  return response.data
}

export const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications'); // Use axios for consistent API calls
    return response.data; // Return the data from the API response
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // Propagate the error
  }
};