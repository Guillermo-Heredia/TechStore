import axios from 'axios'
import type { ApiError } from '../types'

const api = axios.create({
  baseURL: 'https://cs2031-2026-1-pc2-techstore-production.up.railway.app/'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    let message = 'Error del servidor'

    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      message = 'Sesión expirada'
    } else if (status === 404) {
      message = 'Recurso no encontrado'
    } else if (status === 409) {
      message = error.response?.data?.message || 'El recurso ya existe'
    }

    const apiError: ApiError = { message, status }
    return Promise.reject(apiError)
  }
)

export default api
