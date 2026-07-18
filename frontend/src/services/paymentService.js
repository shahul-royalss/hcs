import api from './api'

export const paymentService = {
  /** Create a Stripe payment intent for an optional advance payment. */
  async createIntent(payload) {
    const { data } = await api.post('/payments/create-intent', payload)
    return data
  },
}
