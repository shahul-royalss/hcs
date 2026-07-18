import api, { tokenStore } from './api'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    if (data?.access_token) tokenStore.set(data.access_token)
    return data
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      tokenStore.clear()
    }
  },

  async me() {
    const { data } = await api.get('/auth/me')
    return data
  },

  isAuthenticated() {
    return Boolean(tokenStore.get())
  },
}
