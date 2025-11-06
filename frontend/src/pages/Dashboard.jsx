import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { patientService } from '../services/patientService'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'

function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0
  })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [patientsRes, appointmentsRes] = await Promise.all([
        patientService.getAllPatients({ limit: 1 }),
        appointmentService.getAllAppointments({ limit: 5 })
      ])

      setStats({
        totalPatients: patientsRes.data.pagination.total,
        todayAppointments: appointmentsRes.data.appointments.filter(
          apt => apt.appointment_date === new Date().toISOString().split('T')[0]
        ).length,
        upcomingAppointments: appointmentsRes.data.pagination.total
      })

      setRecentAppointments(appointmentsRes.data.appointments)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
          <p className="text-4xl font-bold">{stats.totalPatients}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <p className="text-4xl font-bold">{stats.todayAppointments}</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Upcoming Appointments</h3>
          <p className="text-4xl font-bold">{stats.upcomingAppointments}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/patients" className="btn btn-primary">
            Add New Patient
          </Link>
          <Link to="/appointments" className="btn btn-primary">
            Schedule Appointment
          </Link>
          <Link to="/medical-records" className="btn btn-primary">
            Create Medical Record
          </Link>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Appointments</h2>
        {recentAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      {appointment.patient.first_name} {appointment.patient.last_name}
                    </td>
                    <td>
                      Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}
                    </td>
                    <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                    <td>{appointment.appointment_time}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
