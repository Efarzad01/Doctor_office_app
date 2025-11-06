# Doctor's Office Application - System Architecture

## Overview
A comprehensive data entry and management system for doctor's offices with patient management, appointment scheduling, medical records, and billing capabilities.

## Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: helmet, cors, bcrypt

### Frontend
- **Framework**: React (v18+)
- **Routing**: React Router v6
- **State Management**: React Context API + Hooks
- **HTTP Client**: Axios
- **UI Components**: Custom components with Tailwind CSS
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns

### DevOps
- **Containerization**: Docker & Docker Compose
- **Environment Management**: dotenv
- **API Documentation**: Swagger/OpenAPI

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Frontend (Port 3000)                  │  │
│  │  - Patient Management  - Appointments                 │  │
│  │  - Medical Records     - Billing                      │  │
│  │  - Doctor Dashboard    - Reports                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Express.js Server (Port 5000)                  │  │
│  │  - Authentication Middleware                          │  │
│  │  - Request Validation                                 │  │
│  │  - Error Handling                                     │  │
│  │  - Rate Limiting                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌────────────┬────────────┬────────────┬────────────┐     │
│  │  Patient   │  Doctor    │Appointment │  Medical   │     │
│  │  Service   │  Service   │  Service   │  Records   │     │
│  │            │            │            │  Service   │     │
│  └────────────┴────────────┴────────────┴────────────┘     │
│  ┌────────────┬────────────┬────────────────────────┐      │
│  │  Billing   │   Auth     │    Notification        │      │
│  │  Service   │  Service   │    Service             │      │
│  └────────────┴────────────┴────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Sequelize ORM                            │  │
│  │  - Models      - Migrations    - Seeders             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database (Port 5432)               │  │
│  │  - users          - patients      - doctors           │  │
│  │  - appointments   - medical_records                   │  │
│  │  - prescriptions  - billing       - insurance         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Entities

1. **users** - System users (doctors, receptionists, admins)
   - id, email, password_hash, role, first_name, last_name, created_at, updated_at

2. **patients** - Patient information
   - id, first_name, last_name, date_of_birth, gender, ssn, phone, email, address, emergency_contact, blood_type, allergies, created_at, updated_at

3. **doctors** - Doctor profiles
   - id, user_id, license_number, specialization, qualification, experience_years, consultation_fee, available_days, created_at, updated_at

4. **appointments** - Appointment scheduling
   - id, patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, reason, notes, created_at, updated_at

5. **medical_records** - Patient medical history
   - id, patient_id, doctor_id, appointment_id, diagnosis, symptoms, treatment_plan, notes, record_date, created_at, updated_at

6. **prescriptions** - Medication prescriptions
   - id, medical_record_id, medication_name, dosage, frequency, duration_days, instructions, created_at, updated_at

7. **billing** - Billing and payments
   - id, patient_id, appointment_id, total_amount, paid_amount, payment_status, payment_method, payment_date, created_at, updated_at

8. **insurance** - Insurance information
   - id, patient_id, provider_name, policy_number, group_number, valid_from, valid_until, coverage_details, created_at, updated_at

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user

### Patients
- GET /api/patients - List all patients (paginated)
- GET /api/patients/:id - Get patient details
- POST /api/patients - Create new patient
- PUT /api/patients/:id - Update patient
- DELETE /api/patients/:id - Delete patient
- GET /api/patients/:id/history - Get patient medical history

### Doctors
- GET /api/doctors - List all doctors
- GET /api/doctors/:id - Get doctor details
- POST /api/doctors - Create doctor profile
- PUT /api/doctors/:id - Update doctor
- GET /api/doctors/:id/schedule - Get doctor's schedule

### Appointments
- GET /api/appointments - List appointments (with filters)
- GET /api/appointments/:id - Get appointment details
- POST /api/appointments - Create appointment
- PUT /api/appointments/:id - Update appointment
- DELETE /api/appointments/:id - Cancel appointment
- GET /api/appointments/available-slots - Get available time slots

### Medical Records
- GET /api/medical-records - List medical records
- GET /api/medical-records/:id - Get record details
- POST /api/medical-records - Create medical record
- PUT /api/medical-records/:id - Update medical record

### Prescriptions
- GET /api/prescriptions - List prescriptions
- GET /api/prescriptions/:id - Get prescription details
- POST /api/prescriptions - Create prescription
- PUT /api/prescriptions/:id - Update prescription

### Billing
- GET /api/billing - List billing records
- GET /api/billing/:id - Get billing details
- POST /api/billing - Create billing record
- PUT /api/billing/:id - Update billing record
- POST /api/billing/:id/payment - Record payment

## Security Features

1. **Authentication**: JWT-based authentication
2. **Authorization**: Role-based access control (Admin, Doctor, Receptionist)
3. **Password Security**: bcrypt hashing
4. **Data Validation**: Input validation on all endpoints
5. **CORS**: Configured for frontend origin
6. **Rate Limiting**: Prevent API abuse
7. **SQL Injection Prevention**: Sequelize ORM parameterized queries
8. **XSS Protection**: Helmet.js security headers

## User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration

### Doctor
- View assigned patients
- Access medical records
- Create prescriptions
- Manage appointments
- View billing information

### Receptionist
- Patient registration
- Appointment scheduling
- Basic patient information updates
- Check-in/check-out

## Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── patients/        # Patient-related components
│   │   ├── appointments/    # Appointment components
│   │   ├── doctors/         # Doctor components
│   │   ├── medical-records/ # Medical record components
│   │   └── billing/         # Billing components
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Patients.jsx
│   │   ├── Appointments.jsx
│   │   └── Login.jsx
│   ├── context/             # React Context for state
│   ├── services/            # API service calls
│   ├── utils/               # Helper functions
│   ├── hooks/               # Custom React hooks
│   └── App.jsx
```

## Deployment Strategy

1. **Development**: Docker Compose for local development
2. **Staging**: Container orchestration (Docker Swarm/Kubernetes)
3. **Production**: Cloud deployment (AWS/Azure/GCP)
4. **Database**: Managed PostgreSQL service
5. **Monitoring**: Application logs and health checks
6. **Backup**: Automated database backups

## Future Enhancements

- Real-time notifications (WebSocket)
- Document/image upload for medical records
- Lab test results integration
- Email/SMS notifications
- Telemedicine video consultation
- Analytics and reporting dashboard
- Mobile application (React Native)
- Integration with pharmacy systems
- HIPAA compliance features
