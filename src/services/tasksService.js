import { apiClient } from '@/services/apiClient'

export const getTasks = async () => {
  const { data } = await apiClient.get('/tasks')
  return data
}

export const createTaskService = async payload => {
  const { data } = await apiClient.post('/tasks', payload)
  return data
}

export const updateTaskService = async ({ id, updates }) => {
  const { data } = await apiClient.put(`/tasks/${id}`, updates)
  return data
}

export const deleteTaskService = async id => {
  await apiClient.delete(`/tasks/${id}`)
  return id
}

