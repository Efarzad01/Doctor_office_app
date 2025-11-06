module.exports = (sequelize, DataTypes) => {
  const Billing = sequelize.define('Billing', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    appointment_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'appointments',
        key: 'id'
      }
    },
    invoice_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'partial', 'paid', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'insurance', 'check', 'other'),
      allowNull: true
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'billing',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['patient_id']
      },
      {
        fields: ['payment_status']
      },
      {
        fields: ['invoice_number']
      }
    ]
  });

  return Billing;
};
