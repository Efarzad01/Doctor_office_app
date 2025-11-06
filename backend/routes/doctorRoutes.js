const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const doctorController = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');

// Validation rules
const doctorValidation = [
  body('user_id').isUUID().withMessage('Valid user ID is required'),
  body('license_number').notEmpty().withMessage('License number is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('qualification').notEmpty().withMessage('Qualification is required'),
  body('consultation_fee').isDecimal().withMessage('Valid consultation fee is required')
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', authorize('admin'), doctorValidation, validate, doctorController.createDoctor);
router.put('/:id', authorize('admin', 'doctor'), doctorController.updateDoctor);
router.get('/:id/schedule', doctorController.getDoctorSchedule);

module.exports = router;
