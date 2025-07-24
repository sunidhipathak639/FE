import api from '@/lib/axios'

export const getAllUsers = async () => {
  const response = await api.get('/users')
  return response.data
}
export const updateUser = async (
  id: string,
  payload: { name: string; email: string; role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'TESTER' | 'VIEWER' }
) => {
  const response = await api.patch(`/users/${id}`, payload);
  return response.data;
};