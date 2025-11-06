import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { patientService } from '../services/patientService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PatientForm from '../components/patients/PatientForm'
import Modal from '../components/common/Modal'

function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })

  useEffect(() => {
    loadPatients()
  }, [pagination.page, search])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await patientService.getAllPatients({
        page: pagination.page,
        limit: pagination.limit,
        search
      })
      setPatients(response.data.patients)
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
    } catch (error) {
      console.error('Error loading patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePatientCreated = () => {
    setShowModal(false)
    loadPatients()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          Add New Patient
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search patients by name, email, or phone..."
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Patients Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : patients.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No patients found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </td>
                      <td>{new Date(patient.date_of_birth).toLocaleDateString()}</td>
                      <td className="capitalize">{patient.gender}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.email || '-'}</td>
                      <td>
                        <Link
                          to={`/patients/${patient.id}`}
                          className="text-primary-600 hover:text-primary-800 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {patients.length} of {pagination.total} patients
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Patient Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Patient"
      >
        <PatientForm onSuccess={handlePatientCreated} />
      </Modal>
    </div>
  )
}

export default Patients
