const db = require('../models');
const { Op } = require('sequelize');

// Get all appointments with filters
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, doctor_id, patient_id, date } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (doctor_id) whereClause.doctor_id = doctor_id;
    if (patient_id) whereClause.patient_id = patient_id;
    if (date) whereClause.appointment_date = date;

    const { count, rows } = await db.Appointment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Patient,
          as: 'patient',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email']
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
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        appointments: rows,
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
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await db.Appointment.findByPk(id, {
      include: [
        {
          model: db.Patient,
          as: 'patient'
        },
        {
          model: db.Doctor,
          as: 'doctor',
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['first_name', 'last_name', 'email', 'phone']
            }
          ]
        },
        {
          model: db.MedicalRecord,
          as: 'medicalRecord',
          required: false
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, duration_minutes } = req.body;

    // Check for conflicting appointments
    const conflictingAppointment = await db.Appointment.findOne({
      where: {
        doctor_id,
        appointment_date,
        appointment_time,
        status: { [Op.notIn]: ['cancelled', 'no-show'] }
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const appointment = await db.Appointment.create(req.body);

    const appointmentWithDetails = await db.Appointment.findByPk(appointment.id, {
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
      message: 'Appointment created successfully',
      data: { appointment: appointmentWithDetails }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await db.Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.update(req.body);

    const updatedAppointment = await db.Appointment.findByPk(id, {
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

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment: updatedAppointment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await db.Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};

// Get available time slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({
        success: false,
        message: 'doctor_id and date are required'
      });
    }

    const doctor = await db.Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get booked appointments for the day
    const bookedAppointments = await db.Appointment.findAll({
      where: {
        doctor_id,
        appointment_date: date,
        status: { [Op.notIn]: ['cancelled', 'no-show'] }
      },
      attributes: ['appointment_time', 'duration_minutes']
    });

    res.json({
      success: true,
      data: {
        doctor: {
          available_from: doctor.available_from,
          available_to: doctor.available_to,
          available_days: doctor.available_days
        },
        bookedSlots: bookedAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};
