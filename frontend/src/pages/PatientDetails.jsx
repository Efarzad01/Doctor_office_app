import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { patientService } from '../services/patientService'
import LoadingSpinner from '../components/common/LoadingSpinner'

function PatientDetails() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [medicalHistory, setMedicalHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatientData()
  }, [id])

  const loadPatientData = async () => {
    try {
      const [patientRes, historyRes] = await Promise.all([
        patientService.getPatientById(id),
        patientService.getPatientHistory(id)
      ])
      setPatient(patientRes.data.patient)
      setMedicalHistory(historyRes.data.medicalRecords || [])
    } catch (error) {
      console.error('Error loading patient:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="large" />
  }

  if (!patient) {
    return <div>Patient not found</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Details</h1>

      {/* Patient Information */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{patient.first_name} {patient.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-medium">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium capitalize">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{patient.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{patient.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Blood Type</p>
            <p className="font-medium">{patient.blood_type || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">
              {patient.address && `${patient.address}, `}
              {patient.city && `${patient.city}, `}
              {patient.state} {patient.zip_code}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Allergies</p>
            <p className="font-medium">{patient.allergies || 'None reported'}</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      {patient.emergency_contact_name && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{patient.emergency_contact_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{patient.emergency_contact_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Relationship</p>
              <p className="font-medium capitalize">{patient.emergency_contact_relation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Medical History */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Medical History</h2>
        {medicalHistory.length === 0 ? (
          <p className="text-gray-500">No medical records found</p>
        ) : (
          <div className="space-y-4">
            {medicalHistory.map((record) => (
              <div key={record.id} className="border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-lg">{record.diagnosis}</p>
                    <p className="text-sm text-gray-600">
                      Dr. {record.doctor.user.first_name} {record.doctor.user.last_name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(record.record_date).toLocaleDateString()}
                  </p>
                </div>
                {record.symptoms && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Symptoms:</span> {record.symptoms}
                  </p>
                )}
                {record.treatment_plan && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Treatment:</span> {record.treatment_plan}
                  </p>
                )}
                {record.prescriptions && record.prescriptions.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-sm mb-1">Prescriptions:</p>
                    <ul className="list-disc list-inside text-sm">
                      {record.prescriptions.map((prescription) => (
                        <li key={prescription.id}>
                          {prescription.medication_name} - {prescription.dosage} ({prescription.frequency})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientDetails
