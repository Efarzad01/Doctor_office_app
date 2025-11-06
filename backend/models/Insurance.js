module.exports = (sequelize, DataTypes) => {
  const Insurance = sequelize.define('Insurance', {
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
    provider_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    policy_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    group_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subscriber_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    relationship_to_subscriber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    valid_from: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    valid_until: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    coverage_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'insurance',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['patient_id']
      },
      {
        fields: ['policy_number']
      }
    ]
  });

  return Insurance;
};
