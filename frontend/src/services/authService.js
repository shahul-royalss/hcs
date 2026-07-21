import api, { tokenStore } from './api'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    // On static hosting the SPA rewrite can answer /api requests with the
    // app's own HTML and a 200 — never treat that as a successful login.
    if (!data?.access_token || !data?.user) {
      throw new Error(
        'The care portal API is not reachable from this site. The backend server must be running and connected (VITE_BACKEND_URL).'
      )
    }
    tokenStore.set(data.access_token)
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
