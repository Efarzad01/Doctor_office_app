import { useState, useEffect } from 'react'
import { doctorService } from '../services/doctorService'
import LoadingSpinner from '../components/common/LoadingSpinner'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors()
      setDoctors(response.data.doctors)
    } catch (error) {
      console.error('Error loading doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : doctors.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No doctors found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600">
                    {doctor.user.first_name[0]}{doctor.user.last_name[0]}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">
                      Dr. {doctor.user.first_name} {doctor.user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">License:</span> {doctor.license_number}
                  </p>
                  <p>
                    <span className="font-medium">Qualification:</span> {doctor.qualification}
                  </p>
                  <p>
                    <span className="font-medium">Experience:</span> {doctor.experience_years} years
                  </p>
                  <p>
                    <span className="font-medium">Consultation Fee:</span> ${doctor.consultation_fee}
                  </p>
                  <p>
                    <span className="font-medium">Contact:</span> {doctor.user.phone}
                  </p>
                </div>

                <button className="btn btn-primary w-full mt-4">
                  View Schedule
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors
