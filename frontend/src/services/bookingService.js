import api from './api'

export const bookingService = {
  /** Create a booking from the multi-step form payload. */
  async create(payload) {
    const { data } = await api.post('/bookings', payload)
    return data
  },

  async checkAvailability(params) {
    const { data } = await api.get('/bookings/check-availability', { params })
    return data
  },

  async checkServiceArea(pincode) {
    const { data } = await api.post('/bookings/check-service-area', { pincode })
    return data
  },

  // Admin
  async list(params) {
    const { data } = await api.get('/admin/bookings', { params })
    return data
  },

  async get(id) {
    const { data } = await api.get(`/admin/bookings/${id}`)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/admin/bookings/${id}`, payload)
    return data
  },

  async cancel(id) {
    const { data } = await api.delete(`/admin/bookings/${id}`)
    return data
  },

  async assignStaff(id, staffId) {
    const { data } = await api.post(`/admin/bookings/${id}/assign-staff`, { staff_id: staffId })
    return data
  },
}
