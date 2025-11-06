import api from './api'

export const appointmentService = {
  async getAllAppointments(params = {}) {
    const response = await api.get('/appointments', { params })
    return response.data
  },

  async getAppointmentById(id) {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  },

  async createAppointment(appointmentData) {
    const response = await api.post('/appointments', appointmentData)
    return response.data
  },

  async updateAppointment(id, appointmentData) {
    const response = await api.put(`/appointments/${id}`, appointmentData)
    return response.data
  },

  async cancelAppointment(id) {
    const response = await api.delete(`/appointments/${id}`)
    return response.data
  },

  async getAvailableSlots(doctorId, date) {
    const response = await api.get('/appointments/available-slots', {
      params: { doctor_id: doctorId, date }
    })
    return response.data
  }
}
