const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const billingController = require('../controllers/billingController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');

// Validation rules
const billingValidation = [
  body('patient_id').isUUID().withMessage('Valid patient ID is required'),
  body('total_amount').isDecimal().withMessage('Valid total amount is required')
];

const paymentValidation = [
  body('amount').isDecimal({ gt: 0 }).withMessage('Valid payment amount is required'),
  body('payment_method').isIn(['cash', 'credit_card', 'debit_card', 'insurance', 'check', 'other']).withMessage('Valid payment method is required')
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', billingController.getAllBilling);
router.get('/:id', billingController.getBillingById);
router.post('/', authorize('admin', 'receptionist'), billingValidation, validate, billingController.createBilling);
router.put('/:id', authorize('admin', 'receptionist'), billingController.updateBilling);
router.post('/:id/payment', authorize('admin', 'receptionist'), paymentValidation, validate, billingController.recordPayment);

module.exports = router;
