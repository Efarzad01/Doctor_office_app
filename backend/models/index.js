const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize, Sequelize);
db.Patient = require('./Patient')(sequelize, Sequelize);
db.Doctor = require('./Doctor')(sequelize, Sequelize);
db.Appointment = require('./Appointment')(sequelize, Sequelize);
db.MedicalRecord = require('./MedicalRecord')(sequelize, Sequelize);
db.Prescription = require('./Prescription')(sequelize, Sequelize);
db.Billing = require('./Billing')(sequelize, Sequelize);
db.Insurance = require('./Insurance')(sequelize, Sequelize);

// Define associations
// User - Doctor (One-to-One)
db.User.hasOne(db.Doctor, { foreignKey: 'user_id', as: 'doctorProfile' });
db.Doctor.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

// Patient - Appointments (One-to-Many)
db.Patient.hasMany(db.Appointment, { foreignKey: 'patient_id', as: 'appointments' });
db.Appointment.belongsTo(db.Patient, { foreignKey: 'patient_id', as: 'patient' });

// Doctor - Appointments (One-to-Many)
db.Doctor.hasMany(db.Appointment, { foreignKey: 'doctor_id', as: 'appointments' });
db.Appointment.belongsTo(db.Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

// Patient - Medical Records (One-to-Many)
db.Patient.hasMany(db.MedicalRecord, { foreignKey: 'patient_id', as: 'medicalRecords' });
db.MedicalRecord.belongsTo(db.Patient, { foreignKey: 'patient_id', as: 'patient' });

// Doctor - Medical Records (One-to-Many)
db.Doctor.hasMany(db.MedicalRecord, { foreignKey: 'doctor_id', as: 'medicalRecords' });
db.MedicalRecord.belongsTo(db.Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

// Appointment - Medical Record (One-to-One)
db.Appointment.hasOne(db.MedicalRecord, { foreignKey: 'appointment_id', as: 'medicalRecord' });
db.MedicalRecord.belongsTo(db.Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

// Medical Record - Prescriptions (One-to-Many)
db.MedicalRecord.hasMany(db.Prescription, { foreignKey: 'medical_record_id', as: 'prescriptions' });
db.Prescription.belongsTo(db.MedicalRecord, { foreignKey: 'medical_record_id', as: 'medicalRecord' });

// Patient - Billing (One-to-Many)
db.Patient.hasMany(db.Billing, { foreignKey: 'patient_id', as: 'billings' });
db.Billing.belongsTo(db.Patient, { foreignKey: 'patient_id', as: 'patient' });

// Appointment - Billing (One-to-One)
db.Appointment.hasOne(db.Billing, { foreignKey: 'appointment_id', as: 'billing' });
db.Billing.belongsTo(db.Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

// Patient - Insurance (One-to-Many)
db.Patient.hasMany(db.Insurance, { foreignKey: 'patient_id', as: 'insurances' });
db.Insurance.belongsTo(db.Patient, { foreignKey: 'patient_id', as: 'patient' });

module.exports = db;
