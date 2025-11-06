const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const prescriptionController = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');

// Validation rules
const prescriptionValidation = [
  body('medical_record_id').isUUID().withMessage('Valid medical record ID is required'),
  body('medication_name').notEmpty().withMessage('Medication name is required'),
  body('dosage').notEmpty().withMessage('Dosage is required'),
  body('frequency').notEmpty().withMessage('Frequency is required'),
  body('duration_days').isInt({ min: 1 }).withMessage('Valid duration is required')
];

// All routes require authentication
router.use(authenticate);

// Routes - Only doctors and admins can manage prescriptions
router.get('/', authorize('admin', 'doctor'), prescriptionController.getAllPrescriptions);
router.get('/:id', authorize('admin', 'doctor'), prescriptionController.getPrescriptionById);
router.post('/', authorize('admin', 'doctor'), prescriptionValidation, validate, prescriptionController.createPrescription);
router.put('/:id', authorize('admin', 'doctor'), prescriptionController.updatePrescription);

module.exports = router;
