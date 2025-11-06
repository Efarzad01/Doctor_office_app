const db = require('../models');
const { Op } = require('sequelize');

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

    const { count, rows } = await db.Patient.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
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
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await db.Patient.findByPk(id, {
      include: [
        {
          model: db.Insurance,
          as: 'insurances',
          where: { is_active: true },
          required: false
        }
      ]
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
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      error: error.message
    });
  }
};

// Create new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = await db.Patient.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { patient }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating patient',
      error: error.message
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await db.Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.update(req.body);

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
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
    res.status(500).json({
      success: false,
      message: 'Error deleting patient',
      error: error.message
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
    res.status(500).json({
      success: false,
      message: 'Error fetching patient history',
      error: error.message
    });
  }
};
