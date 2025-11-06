const db = require('../models');

// Get all medical records
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, patient_id, doctor_id } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (patient_id) whereClause.patient_id = patient_id;
    if (doctor_id) whereClause.doctor_id = doctor_id;

    const { count, rows } = await db.MedicalRecord.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Patient,
          as: 'patient',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: db.Doctor,
          as: 'doctor',
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['first_name', 'last_name']
            }
          ]
        },
        {
          model: db.Prescription,
          as: 'prescriptions'
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['record_date', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        medicalRecords: rows,
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
      message: 'Error fetching medical records',
      error: error.message
    });
  }
};

// Get medical record by ID
exports.getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalRecord = await db.MedicalRecord.findByPk(id, {
      include: [
        {
          model: db.Patient,
          as: 'patient'
        },
        {
          model: db.Doctor,
          as: 'doctor',
          include: [{ model: db.User, as: 'user' }]
        },
        {
          model: db.Appointment,
          as: 'appointment',
          required: false
        },
        {
          model: db.Prescription,
          as: 'prescriptions'
        }
      ]
    });

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    res.json({
      success: true,
      data: { medicalRecord }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medical record',
      error: error.message
    });
  }
};

// Create medical record
exports.createMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await db.MedicalRecord.create(req.body);

    const medicalRecordWithDetails = await db.MedicalRecord.findByPk(medicalRecord.id, {
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
    });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: { medicalRecord: medicalRecordWithDetails }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating medical record',
      error: error.message
    });
  }
};

// Update medical record
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalRecord = await db.MedicalRecord.findByPk(id);
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    await medicalRecord.update(req.body);

    const updatedRecord = await db.MedicalRecord.findByPk(id, {
      include: [
        {
          model: db.Patient,
          as: 'patient'
        },
        {
          model: db.Doctor,
          as: 'doctor',
          include: [{ model: db.User, as: 'user' }]
        },
        {
          model: db.Prescription,
          as: 'prescriptions'
        }
      ]
    });

    res.json({
      success: true,
      message: 'Medical record updated successfully',
      data: { medicalRecord: updatedRecord }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating medical record',
      error: error.message
    });
  }
};
