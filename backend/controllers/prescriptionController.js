const db = require('../models');

// Get all prescriptions
exports.getAllPrescriptions = async (req, res) => {
  try {
    const { medical_record_id } = req.query;

    const whereClause = {};
    if (medical_record_id) whereClause.medical_record_id = medical_record_id;

    const prescriptions = await db.Prescription.findAll({
      where: whereClause,
      include: [
        {
          model: db.MedicalRecord,
          as: 'medicalRecord',
          include: [
            {
              model: db.Patient,
              as: 'patient',
              attributes: ['id', 'first_name', 'last_name']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: { prescriptions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescriptions',
      error: error.message
    });
  }
};

// Get prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await db.Prescription.findByPk(id, {
      include: [
        {
          model: db.MedicalRecord,
          as: 'medicalRecord',
          include: [
            {
              model: db.Patient,
              as: 'patient'
            },
            {
              model: db.Doctor,
              as: 'doctor',
              include: [{ model: db.User, as: 'user' }]
            }
          ]
        }
      ]
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      data: { prescription }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescription',
      error: error.message
    });
  }
};

// Create prescription
exports.createPrescription = async (req, res) => {
  try {
    const prescription = await db.Prescription.create(req.body);

    const prescriptionWithDetails = await db.Prescription.findByPk(prescription.id, {
      include: [
        {
          model: db.MedicalRecord,
          as: 'medicalRecord',
          include: [{ model: db.Patient, as: 'patient' }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: { prescription: prescriptionWithDetails }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating prescription',
      error: error.message
    });
  }
};

// Update prescription
exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await db.Prescription.findByPk(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    await prescription.update(req.body);

    const updatedPrescription = await db.Prescription.findByPk(id, {
      include: [
        {
          model: db.MedicalRecord,
          as: 'medicalRecord',
          include: [{ model: db.Patient, as: 'patient' }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Prescription updated successfully',
      data: { prescription: updatedPrescription }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating prescription',
      error: error.message
    });
  }
};
