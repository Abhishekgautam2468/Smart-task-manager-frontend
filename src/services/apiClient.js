import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:5050/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const payload = error.response.data
      const message =
        (typeof payload === 'string' && payload) ||
        payload?.message ||
        'Request failed with server error'
      const normalizedError = new Error(message)
      normalizedError.status = error.response.status
      normalizedError.data = payload
      return Promise.reject(normalizedError)
    }

    if (error.request) {
      return Promise.reject(new Error('Network error, please try again'))
    }

    return Promise.reject(new Error('Unexpected error, please try again'))
  }
)
