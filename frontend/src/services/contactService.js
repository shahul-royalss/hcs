import api from './api'

export const contactService = {
  async submit(payload) {
    const { data } = await api.post('/contact', payload)
    return data
  },

  async requestCallback(payload) {
    const { data } = await api.post('/contact/callback', payload)
    return data
  },

  async emergency(payload) {
    const { data } = await api.post('/emergency', payload)
    return data
  },
}
