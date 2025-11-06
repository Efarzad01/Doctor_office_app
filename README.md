# Doctor's Office Management System

A comprehensive, production-ready data entry and management application for doctor's offices built with modern web technologies.

## Features

- **Patient Management**: Complete patient registration, profile management, and medical history tracking
- **Appointment Scheduling**: Book, manage, and track appointments with availability checking
- **Medical Records**: Digital medical records with diagnosis, treatment plans, and prescriptions
- **Doctor Management**: Manage doctor profiles, specializations, and schedules
- **Billing & Payments**: Invoice generation, payment tracking, and insurance management
- **Role-Based Access Control**: Admin, Doctor, and Receptionist roles with appropriate permissions
- **Real-time Dashboard**: Statistics and recent activity overview
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing

## Technology Stack

### Backend
- **Node.js** (v18+) - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **React** (v18+) - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **date-fns** - Date manipulation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
Doctor_office_app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── medicalRecordController.js
│   │   ├── prescriptionController.js
│   │   └── billingController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── models/
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── MedicalRecord.js
│   │   ├── Prescription.js
│   │   ├── Billing.js
│   │   └── Insurance.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── medicalRecordRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   └── billingRoutes.js
│   ├── utils/
│   │   └── jwt.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── Modal.jsx
│   │   │   └── patients/
│   │   │       └── PatientForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Patients.jsx
│   │   │   ├── PatientDetails.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── MedicalRecords.jsx
│   │   │   └── Billing.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── patientService.js
│   │   │   ├── doctorService.js
│   │   │   └── appointmentService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── docker-compose.yml
├── ARCHITECTURE.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- npm or yarn
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

#### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd Doctor_office_app
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

4. Create the database tables:
```bash
docker-compose exec backend npm run migrate
```

5. (Optional) Seed the database with sample data:
```bash
docker-compose exec backend npm run seed
```

#### Option 2: Manual Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Doctor_office_app
```

2. Set up PostgreSQL database:
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE doctor_office_db;
\q
```

3. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

4. Set up the frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

5. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Database Setup

The application uses Sequelize ORM. Database tables will be automatically created when you start the server in development mode.

For production, use migrations:
```bash
cd backend
npm run migrate
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Patient Endpoints

- `GET /api/patients` - Get all patients (with pagination and search)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/:id/history` - Get patient medical history

### Doctor Endpoints

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor profile
- `PUT /api/doctors/:id` - Update doctor
- `GET /api/doctors/:id/schedule` - Get doctor's schedule

### Appointment Endpoints

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/available-slots` - Get available time slots

### Medical Records Endpoints

- `GET /api/medical-records` - Get all medical records
- `GET /api/medical-records/:id` - Get medical record by ID
- `POST /api/medical-records` - Create medical record
- `PUT /api/medical-records/:id` - Update medical record

### Prescription Endpoints

- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/:id` - Get prescription by ID
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription

### Billing Endpoints

- `GET /api/billing` - Get all billing records
- `GET /api/billing/:id` - Get billing record by ID
- `POST /api/billing` - Create billing record
- `PUT /api/billing/:id` - Update billing record
- `POST /api/billing/:id/payment` - Record payment

## User Roles and Permissions

### Admin
- Full system access
- User management
- All CRUD operations

### Doctor
- View assigned patients
- Access medical records
- Create prescriptions
- Manage appointments
- View billing information

### Receptionist
- Patient registration
- Appointment scheduling
- Patient information updates
- Check-in/check-out
- Billing management

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=doctor_office_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control (RBAC)
- Input validation on all endpoints
- CORS protection
- Rate limiting
- SQL injection prevention (Sequelize ORM)
- XSS protection (Helmet.js)
- Secure HTTP headers

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Deployment

### Docker Deployment

1. Build production images:
```bash
docker-compose -f docker-compose.prod.yml build
```

2. Start services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Traditional Deployment

1. Set up a production PostgreSQL database
2. Configure environment variables
3. Build the frontend: `cd frontend && npm run build`
4. Serve frontend static files with nginx or similar
5. Run backend with PM2: `pm2 start backend/server.js`

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify database exists: `psql -U postgres -l`

### Port Already in Use

- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env

### Docker Issues

```bash
# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Rebuild containers
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the repository
- Contact: support@example.com

## Acknowledgments

- Built with modern web development best practices
- Follows HIPAA compliance guidelines for healthcare data
- Designed for scalability and maintainability

## Roadmap

- [ ] Real-time notifications (WebSocket)
- [ ] Document upload for medical records
- [ ] Lab test results integration
- [ ] Email/SMS notifications
- [ ] Telemedicine video consultation
- [ ] Analytics dashboard
- [ ] Mobile application
- [ ] Pharmacy system integration
- [ ] Insurance claims processing
- [ ] Multi-language support
