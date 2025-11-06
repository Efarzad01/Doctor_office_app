const db = require('../models');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;

    const whereClause = specialization ? { specialization, is_active: true } : { is_active: true };

    const doctors = await db.Doctor.findAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email', 'phone']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: { doctors }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await db.Doctor.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email', 'phone']
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message
    });
  }
};

// Create doctor profile
exports.createDoctor = async (req, res) => {
  try {
    const doctor = await db.Doctor.create(req.body);

    const doctorWithUser = await db.Doctor.findByPk(doctor.id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email', 'phone']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: { doctor: doctorWithUser }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating doctor profile',
      error: error.message
    });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await db.Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    await doctor.update(req.body);

    const updatedDoctor = await db.Doctor.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: { doctor: updatedDoctor }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
};

// Get doctor's schedule
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const whereClause = { doctor_id: id };
    if (date) {
      whereClause.appointment_date = date;
    }

    const appointments = await db.Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: db.Patient,
          as: 'patient',
          attributes: ['first_name', 'last_name', 'phone']
        }
      ],
      order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']]
    });

    res.json({
      success: true,
      data: { appointments }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor schedule',
      error: error.message
    });
  }
};
