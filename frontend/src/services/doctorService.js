import api from './api'

export const doctorService = {
  async getAllDoctors(params = {}) {
    const response = await api.get('/doctors', { params })
    return response.data
  },

  async getDoctorById(id) {
    const response = await api.get(`/doctors/${id}`)
    return response.data
  },

  async createDoctor(doctorData) {
    const response = await api.post('/doctors', doctorData)
    return response.data
  },

  async updateDoctor(id, doctorData) {
    const response = await api.put(`/doctors/${id}`, doctorData)
    return response.data
  },

  async getDoctorSchedule(id, date) {
    const response = await api.get(`/doctors/${id}/schedule`, {
      params: date ? { date } : {}
    })
    return response.data
  }
}
