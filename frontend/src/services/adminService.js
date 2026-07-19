import api from './api'

/** Admin portal APIs (auth required). */
export const adminService = {
  // Dashboard / analytics
  async dashboard() {
    const { data } = await api.get('/admin/analytics/dashboard')
    return data
  },
  async bookingTrends() {
    const { data } = await api.get('/admin/analytics/bookings')
    return data
  },
  async revenue() {
    const { data } = await api.get('/admin/analytics/revenue')
    return data
  },
  async popularServices() {
    const { data } = await api.get('/admin/analytics/services')
    return data
  },

  // Staff
  async listStaff(params) {
    const { data } = await api.get('/admin/staff', { params })
    return data
  },
  async createStaff(payload) {
    const { data } = await api.post('/admin/staff', payload)
    return data
  },
  async updateStaff(id, payload) {
    const { data } = await api.put(`/admin/staff/${id}`, payload)
    return data
  },
  async deleteStaff(id) {
    const { data } = await api.delete(`/admin/staff/${id}`)
    return data
  },
  async availableStaff() {
    const { data } = await api.get('/admin/staff/available')
    return data
  },

  // Patients
  async listPatients(params) {
    const { data } = await api.get('/admin/patients', { params })
    return data
  },
  async getPatient(id) {
    const { data } = await api.get(`/admin/patients/${id}`)
    return data
  },
  async updatePatient(id, payload) {
    const { data } = await api.put(`/admin/patients/${id}`, payload)
    return data
  },
  async addPatientNote(id, note) {
    const { data } = await api.post(`/admin/patients/${id}/notes`, { note })
    return data
  },

  // Gallery
  async uploadGalleryImage(payload) {
    const { data } = await api.post('/admin/gallery', payload)
    return data
  },
  async updateGalleryImage(id, payload) {
    const { data } = await api.put(`/admin/gallery/${id}`, payload)
    return data
  },
  async deleteGalleryImage(id) {
    const { data } = await api.delete(`/admin/gallery/${id}`)
    return data
  },

  // Testimonials / reviews
  async listTestimonials(params) {
    const { data } = await api.get('/admin/testimonials', { params })
    return data
  },
  async createTestimonial(payload) {
    const { data } = await api.post('/admin/testimonials', payload)
    return data
  },
  async updateTestimonial(id, payload) {
    const { data } = await api.put(`/admin/testimonials/${id}`, payload)
    return data
  },
  async approveTestimonial(id) {
    const { data } = await api.put(`/admin/testimonials/${id}/approve`)
    return data
  },
  async deleteTestimonial(id) {
    const { data } = await api.delete(`/admin/testimonials/${id}`)
    return data
  },

  // Contacts / inquiries
  async listContacts(params) {
    const { data } = await api.get('/admin/contacts', { params })
    return data
  },
  async updateContact(id, payload) {
    const { data } = await api.put(`/admin/contacts/${id}`, payload)
    return data
  },
}
