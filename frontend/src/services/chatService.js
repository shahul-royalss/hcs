import api from './api'

export const chatService = {
  /** Send a message to the AI assistant; returns { reply, session_id }. */
  async send(sessionId, message) {
    const { data } = await api.post('/chat', { session_id: sessionId, message })
    return data
  },

  async history(sessionId) {
    const { data } = await api.get(`/chat/session/${sessionId}`)
    return data
  },
}
