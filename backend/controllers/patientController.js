const db = require('../models');
const { Op } = require('sequelize');

// Allowed fields for patient updates (prevents mass assignment vulnerabilities)
const ALLOWED_UPDATE_FIELDS = [
  'first_name', 'last_name', 'date_of_birth', 'gender', 'ssn',
  'phone', 'email', 'address', 'city', 'state', 'zip_code',
  'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
  'blood_type', 'allergies', 'medical_history', 'insurance_id'
];

/**
 * Sanitize update data to prevent mass assignment attacks
 * @param {Object} data - Request body data
 * @returns {Object} - Sanitized data with only allowed fields
 */
function sanitizePatientData(data) {
  const sanitized = {};
  ALLOWED_UPDATE_FIELDS.forEach(field => {
    if (data.hasOwnProperty(field)) {
      sanitized[field] = data[field];
    }
  });
  return sanitized;
}

// Get all patients with pagination and search
exports.getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search ? {
      [Op.or]: [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    // SECURITY FIX: Pass user context to enable role-based decryption
    const { count, rows } = await db.Patient.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      user: req.user // Enable decryption for authorized roles
    });

    res.json({
      success: true,
      data: {
        patients: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    // SECURITY: Don't expose internal error details in production
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    // SECURITY FIX: Pass user context for decryption
    const patient = await db.Patient.findByPk(id, {
      include: [
        {
          model: db.Insurance,
          as: 'insurances',
          where: { is_active: true },
          required: false
        }
      ],
      user: req.user // Enable decryption for authorized roles
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Create new patient
exports.createPatient = async (req, res) => {
  try {
    // SECURITY FIX: Sanitize input to prevent mass assignment
    const sanitizedData = sanitizePatientData(req.body);

    const patient = await db.Patient.create(sanitizedData);

    // Fetch the created patient with user context for proper display
    const createdPatient = await db.Patient.findByPk(patient.id, {
      user: req.user
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { patient: createdPatient }
    });
  } catch (error) {
    console.error('Error creating patient:', error);

    // Handle specific errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'A patient with this SSN already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating patient',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // SECURITY FIX: Pass user context for finding patient
    const patient = await db.Patient.findByPk(id, {
      user: req.user
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // SECURITY FIX: Sanitize input to prevent mass assignment
    const sanitizedData = sanitizePatientData(req.body);

    await patient.update(sanitizedData);

    // Fetch updated patient with user context
    const updatedPatient = await db.Patient.findByPk(id, {
      user: req.user
    });

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient: updatedPatient }
    });
  } catch (error) {
    console.error('Error updating patient:', error);

    // Handle specific errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Delete patient (soft delete)
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await db.Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.update({ is_active: false });

    res.json({
      success: true,
      message: 'Patient deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting patient',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Get patient medical history
exports.getPatientHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalRecords = await db.MedicalRecord.findAll({
      where: { patient_id: id },
      include: [
        {
          model: db.Doctor,
          as: 'doctor',
          include: [{ model: db.User, as: 'user', attributes: ['first_name', 'last_name'] }]
        },
        {
          model: db.Prescription,
          as: 'prescriptions'
        }
      ],
      order: [['record_date', 'DESC']]
    });

    res.json({
      success: true,
      data: { medicalRecords }
    });
  } catch (error) {
    console.error('Error fetching patient history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient history',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};
