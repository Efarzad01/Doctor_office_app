const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');

// Validation rules
const appointmentValidation = [
  body('patient_id').isUUID().withMessage('Valid patient ID is required'),
  body('doctor_id').isUUID().withMessage('Valid doctor ID is required'),
  body('appointment_date').isDate().withMessage('Valid appointment date is required'),
  body('appointment_time').notEmpty().withMessage('Appointment time is required')
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', appointmentController.getAllAppointments);
router.get('/available-slots', appointmentController.getAvailableSlots);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', authorize('admin', 'receptionist', 'doctor'), appointmentValidation, validate, appointmentController.createAppointment);
router.put('/:id', authorize('admin', 'receptionist', 'doctor'), appointmentController.updateAppointment);
router.delete('/:id', authorize('admin', 'receptionist'), appointmentController.cancelAppointment);

module.exports = router;
