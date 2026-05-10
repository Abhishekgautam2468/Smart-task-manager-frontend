import { apiClient } from '@/services/apiClient'

export const analyzeTasksService = async () => {
  const { data } = await apiClient.post('/ai/tasks/analyze', undefined, {
    timeout: 60000,
  })
  return data
}

export const applyAiPlanService = async recommendations => {
  const { data } = await apiClient.post(
    '/ai/tasks/apply',
    { recommendations },
    { timeout: 30000 }
  )
  return data
}
