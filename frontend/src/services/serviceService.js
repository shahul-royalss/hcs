import api from './api'

/** Read APIs for services/packages/team/testimonials/gallery content. */
export const serviceService = {
  async listServices() {
    const { data } = await api.get('/services')
    return data
  },

  async getService(slug) {
    const { data } = await api.get(`/services/${slug}`)
    return data
  },

  async listPackages() {
    const { data } = await api.get('/packages')
    return data
  },

  async listTeam() {
    const { data } = await api.get('/team')
    return data
  },

  async listTestimonials() {
    const { data } = await api.get('/testimonials')
    return data
  },

  async listGallery(category) {
    const { data } = await api.get(category ? `/gallery/${category}` : '/gallery')
    return data
  },
}
