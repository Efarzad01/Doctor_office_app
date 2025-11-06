const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const medicalRecordController = require('../controllers/medicalRecordController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');

// Validation rules
const medicalRecordValidation = [
  body('patient_id').isUUID().withMessage('Valid patient ID is required'),
  body('doctor_id').isUUID().withMessage('Valid doctor ID is required'),
  body('diagnosis').notEmpty().withMessage('Diagnosis is required')
];

// All routes require authentication
router.use(authenticate);

// Routes - Only doctors and admins can access medical records
router.get('/', authorize('admin', 'doctor'), medicalRecordController.getAllMedicalRecords);
router.get('/:id', authorize('admin', 'doctor'), medicalRecordController.getMedicalRecordById);
router.post('/', authorize('admin', 'doctor'), medicalRecordValidation, validate, medicalRecordController.createMedicalRecord);
router.put('/:id', authorize('admin', 'doctor'), medicalRecordController.updateMedicalRecord);

module.exports = router;
