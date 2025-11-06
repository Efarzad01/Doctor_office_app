const db = require('../models');

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
};

// Get all billing records
exports.getAllBilling = async (req, res) => {
  try {
    const { page = 1, limit = 10, patient_id, payment_status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (patient_id) whereClause.patient_id = patient_id;
    if (payment_status) whereClause.payment_status = payment_status;

    const { count, rows } = await db.Billing.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Patient,
          as: 'patient',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email']
        },
        {
          model: db.Appointment,
          as: 'appointment',
          required: false,
          include: [
            {
              model: db.Doctor,
              as: 'doctor',
              include: [{ model: db.User, as: 'user', attributes: ['first_name', 'last_name'] }]
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        billing: rows,
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
      message: 'Error fetching billing records',
      error: error.message
    });
  }
};

// Get billing by ID
exports.getBillingById = async (req, res) => {
  try {
    const { id } = req.params;

    const billing = await db.Billing.findByPk(id, {
      include: [
        {
          model: db.Patient,
          as: 'patient'
        },
        {
          model: db.Appointment,
          as: 'appointment',
          required: false,
          include: [
            {
              model: db.Doctor,
              as: 'doctor',
              include: [{ model: db.User, as: 'user' }]
            }
          ]
        }
      ]
    });

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found'
      });
    }

    res.json({
      success: true,
      data: { billing }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching billing record',
      error: error.message
    });
  }
};

// Create billing record
exports.createBilling = async (req, res) => {
  try {
    const billingData = {
      ...req.body,
      invoice_number: generateInvoiceNumber()
    };

    const billing = await db.Billing.create(billingData);

    const billingWithDetails = await db.Billing.findByPk(billing.id, {
      include: [
        {
          model: db.Patient,
          as: 'patient'
        },
        {
          model: db.Appointment,
          as: 'appointment',
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Billing record created successfully',
      data: { billing: billingWithDetails }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating billing record',
      error: error.message
    });
  }
};

// Update billing record
exports.updateBilling = async (req, res) => {
  try {
    const { id } = req.params;

    const billing = await db.Billing.findByPk(id);
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found'
      });
    }

    await billing.update(req.body);

    const updatedBilling = await db.Billing.findByPk(id, {
      include: [
        {
          model: db.Patient,
          as: 'patient'
        },
        {
          model: db.Appointment,
          as: 'appointment',
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Billing record updated successfully',
      data: { billing: updatedBilling }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating billing record',
      error: error.message
    });
  }
};

// Record payment
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_method } = req.body;

    const billing = await db.Billing.findByPk(id);
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing record not found'
      });
    }

    const newPaidAmount = parseFloat(billing.paid_amount) + parseFloat(amount);
    const totalAmount = parseFloat(billing.total_amount);

    let payment_status = 'partial';
    if (newPaidAmount >= totalAmount) {
      payment_status = 'paid';
    }

    await billing.update({
      paid_amount: newPaidAmount,
      payment_status,
      payment_method,
      payment_date: new Date()
    });

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: { billing }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
};
