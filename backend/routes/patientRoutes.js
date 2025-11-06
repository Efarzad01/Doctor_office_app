const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');

// Validation rules
const patientValidation = [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('date_of_birth').isDate().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').optional().isEmail().withMessage('Valid email is required')
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', authorize('admin', 'receptionist'), patientValidation, validate, patientController.createPatient);
router.put('/:id', authorize('admin', 'receptionist'), patientController.updatePatient);
router.delete('/:id', authorize('admin'), patientController.deletePatient);
router.get('/:id/history', patientController.getPatientHistory);

module.exports = router;
