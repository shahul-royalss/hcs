import axios from 'axios'

/**
 * Central Axios instance. In development, Vite proxies /api to the FastAPI
 * backend; in production set VITE_BACKEND_URL to the API origin.
 */
const baseURL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/api`
  : '/api'

export const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

const TOKEN_KEY = 'dhrishta_admin_token'

export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
}

api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear()
    }
    return Promise.reject(error)
  }
)

/** Normalise an axios error into a friendly message. */
export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the server. Please check your connection or call us directly.'
  }
  return error?.response?.data?.detail || error?.response?.data?.message || fallback
}

export default api
