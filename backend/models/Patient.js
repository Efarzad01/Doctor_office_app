const { encrypt, decrypt } = require('../utils/encryption');

module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false
    },
    ssn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergency_contact_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergency_contact_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergency_contact_relation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    blood_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medical_history: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    insurance_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'patients',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      /**
       * beforeCreate hook - Encrypts sensitive fields before creating a new patient record
       * Sensitive fields: ssn, medical_history, insurance_id
       */
      beforeCreate: async (patient) => {
        try {
          // Encrypt SSN if provided
          if (patient.ssn) {
            patient.ssn = encrypt(patient.ssn);
          }

          // Encrypt medical history if provided
          if (patient.medical_history) {
            patient.medical_history = encrypt(patient.medical_history);
          }

          // Encrypt insurance ID if provided
          if (patient.insurance_id) {
            patient.insurance_id = encrypt(patient.insurance_id);
          }
        } catch (error) {
          console.error('Error encrypting patient data on create:', error);
          throw new Error('Failed to encrypt sensitive patient data');
        }
      },

      /**
       * beforeUpdate hook - Encrypts sensitive fields before updating a patient record
       * Only encrypts fields that have been modified
       */
      beforeUpdate: async (patient) => {
        try {
          // Encrypt SSN if it was changed and is not already encrypted
          if (patient.changed('ssn') && patient.ssn) {
            // Check if already encrypted (contains IV separator)
            if (!patient.ssn.includes(':')) {
              patient.ssn = encrypt(patient.ssn);
            }
          }

          // Encrypt medical history if it was changed and is not already encrypted
          if (patient.changed('medical_history') && patient.medical_history) {
            if (!patient.medical_history.includes(':')) {
              patient.medical_history = encrypt(patient.medical_history);
            }
          }

          // Encrypt insurance ID if it was changed and is not already encrypted
          if (patient.changed('insurance_id') && patient.insurance_id) {
            if (!patient.insurance_id.includes(':')) {
              patient.insurance_id = encrypt(patient.insurance_id);
            }
          }
        } catch (error) {
          console.error('Error encrypting patient data on update:', error);
          throw new Error('Failed to encrypt sensitive patient data');
        }
      },

      /**
       * afterFind hook - Decrypts sensitive fields after retrieving patient records
       * Only decrypts data for authorized users (admin or doctor roles)
       * The user context should be passed via options.user when querying
       */
      afterFind: async (result, options) => {
        try {
          // Check if user context is provided
          const user = options.user;

          // Only decrypt if user has admin or doctor role
          const canDecrypt = user && (user.role === 'admin' || user.role === 'doctor');

          if (!canDecrypt) {
            // If not authorized, return without decrypting
            return result;
          }

          // Helper function to decrypt a single patient record
          const decryptPatient = (patient) => {
            try {
              if (patient.ssn) {
                patient.ssn = decrypt(patient.ssn);
              }
              if (patient.medical_history) {
                patient.medical_history = decrypt(patient.medical_history);
              }
              if (patient.insurance_id) {
                patient.insurance_id = decrypt(patient.insurance_id);
              }
            } catch (error) {
              console.error('Error decrypting patient data:', error);
              // On decryption error, keep encrypted values to prevent data loss
            }
          };

          // Handle both single record and array of records
          if (Array.isArray(result)) {
            result.forEach(patient => {
              if (patient) {
                decryptPatient(patient);
              }
            });
          } else if (result) {
            decryptPatient(result);
          }

          return result;
        } catch (error) {
          console.error('Error in afterFind hook:', error);
          // Return result without decryption to prevent data loss
          return result;
        }
      }
    }
  });

  return Patient;
};
