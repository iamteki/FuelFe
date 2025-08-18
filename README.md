# Fuel Quota Management System

A comprehensive fuel quota management system built with Spring Boot backend and React frontend to manage fuel distribution during crisis situations.

## 🚀 Features

### Backend (Spring Boot)
- **User Management**: Registration, authentication with JWT
- **Vehicle Registration**: QR code generation for vehicles
- **Quota Management**: Automatic weekly quota calculation and tracking
- **Fuel Station Management**: Station registration and fuel stock tracking
- **Transaction Processing**: Real-time fuel transaction management
- **Security**: Role-based access control (Admin, Station Manager, Vehicle Owner)
- **API Documentation**: Swagger/OpenAPI 3.0

### Frontend (React + Vite)
- **Modern UI**: Beautiful and responsive design with Tailwind CSS
- **Dashboard**: Real-time quota status and activity tracking
- **Vehicle Management**: Register and manage multiple vehicles
- **Station Locator**: Find nearby fuel stations
- **Transaction History**: View fuel purchase history
- **Role-based Access**: Different interfaces for different user roles

## �️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **API Documentation**: Swagger/OpenAPI 3.0
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- **JDK 21** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6+**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FuelFe
```

### 2. Database Setup
1. Start MySQL server
2. Create the database:
```sql
CREATE DATABASE fuel_quota_db;
```
3. Run the SQL script:
```bash
mysql -u root -p fuel_quota_db < database.sql
```

### 3. Backend Setup
```bash
cd backend
# Update application.properties with your MySQL credentials
mvn clean install
mvn spring-boot:run
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Automated Setup (Windows)
Simply run the batch file:
```bash
run-system.bat
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## � Default Accounts

### Admin Account
- **Username**: admin
- **Password**: password

### Vehicle Owner Account
- **Username**: johndoe  
- **Password**: password

## 📱 Usage Guide

### Vehicle Owner
1. **Register**: Create an account
2. **Add Vehicle**: Register your vehicle with details
3. **View Quota**: Check remaining fuel quota
4. **Find Stations**: Locate nearby fuel stations
5. **Track Usage**: Monitor fuel consumption history

### Fuel Station Manager
1. **Login**: Use station manager credentials
2. **Scan QR**: Scan vehicle QR codes
3. **Process Fuel**: Record fuel transactions
4. **Manage Stock**: Update fuel inventory

### Admin
1. **Dashboard**: Monitor system-wide statistics
2. **User Management**: Manage all user accounts
3. **Station Management**: Add/edit fuel stations
4. **Quota Settings**: Configure quota rules
5. **Reports**: Generate system reports

## 🔧 Configuration

### Backend Configuration (application.properties)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/fuel_quota_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT
jwt.secret=your_secret_key
jwt.expiration=86400000

# Server
server.port=8080
```

### Frontend Configuration (.env)
```env
VITE_API_URL=http://localhost:8080/api
```

## 🏗️ Architecture

### Backend Architecture
```
src/
├── main/java/com/fuelquota/
│   ├── entity/          # JPA Entities
│   ├── repository/      # Data Access Layer
│   ├── service/         # Business Logic
│   ├── controller/      # REST Controllers
│   ├── dto/            # Data Transfer Objects
│   ├── security/       # Security Configuration
│   └── config/         # Application Configuration
```

### Frontend Architecture
```
src/
├── components/         # Reusable UI Components
├── pages/             # Page Components
├── contexts/          # React Contexts
├── services/          # API Services
├── utils/            # Utility Functions
└── assets/           # Static Assets
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different access levels for users
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Server-side and client-side validation

## 📊 Quota System

### Quota Calculation
- **Car**: 20L per week (base)
- **Motorcycle**: 4L per week
- **Three Wheeler**: 8L per week
- **Van**: 30L per week
- **Lorry**: 50L per week
- **Bus**: 80L per week
- **Truck**: 100L per week

*Note: Quotas are adjusted based on engine capacity*

### Quota Reset
- Weekly automatic reset every Monday
- Manual reset capability for admins
- Real-time quota tracking

## 🚨 Crisis Management

- **Real-time Monitoring**: Track fuel distribution across regions
- **Emergency Allocation**: Quick quota adjustments during shortages
- **Stock Management**: Monitor fuel station inventory levels
- **Usage Analytics**: Identify consumption patterns

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:8080/swagger-ui.html for interactive API documentation.

### Key Endpoints
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration
- `POST /vehicles/register` - Register vehicle
- `GET /vehicles/my-vehicles` - Get user vehicles
- `GET /stations` - Get fuel stations
- `POST /transactions` - Create fuel transaction

## 🚀 Deployment

### Backend Deployment
1. Build JAR file: `mvn clean package`
2. Deploy to server: `java -jar target/fuel-quota-backend-1.0.0.jar`

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy dist folder to web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- **Email**: support@fuelquota.com
- **Documentation**: [Project Wiki]
- **Issues**: [GitHub Issues]

## 🔄 Version History

- **v1.0.0**: Initial release with core features
- Vehicle registration and QR code generation
- Quota management system
- Basic user authentication
- Fuel station management

---

**Note**: This system is designed for crisis fuel management scenarios and includes features for quota enforcement, real-time monitoring, and efficient distribution tracking.

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/fuel_quota_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
app.jwt.secret=your-secret-key-here
app.jwt.expiration=86400000

# Twilio Configuration (for SMS)
twilio.account.sid=your_twilio_sid
twilio.auth.token=your_twilio_token
twilio.phone.number=your_twilio_phone

# DMT Mock Service URL
dmt.service.url=http://localhost:8081
```

### 4. Run Mock DMT Service

The Mock DMT (Department of Motor Traffic) service runs on port 8081:

```bash
cd mock-dmt-service
mvn spring-boot:run
```

### 5. Run Main Application

Using Maven:
```bash
mvn clean install
mvn spring-boot:run
```

Using NetBeans:
- Open the project in NetBeans
- Right-click on the project → Run

The application will start on `http://localhost:8080`

## 🔑 Default Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`
- Role: `ADMIN`

### Test Vehicle Owner
- Username: `vehicle_owner1`
- Password: `password123`
- Role: `VEHICLE_OWNER`

### Test Fuel Station Owner
- Username: `station_owner1`
- Password: `password123`
- Role: `FUEL_STATION_OWNER`

### Test Fuel Station Operator
- Username: `operator1`
- Password: `password123`
- Role: `FUEL_STATION_OPERATOR`

## 📱 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/check-username?username={username}` - Check username availability
- `GET /auth/check-email?email={email}` - Check email availability

### Vehicle Management
- `POST /vehicle-owner/register` - Register as vehicle owner
- `GET /vehicle-owner/profile` - Get profile details
- `POST /vehicle-owner/vehicles` - Register a new vehicle
- `GET /vehicle-owner/vehicles` - List all vehicles
- `GET /vehicle-owner/vehicles/{id}` - Get vehicle details
- `GET /vehicle-owner/vehicles/{id}/qr-code` - Get vehicle QR code

### Fuel Station Management
- `POST /fuel-station/register` - Register fuel station
- `GET /fuel-station/my-station` - Get station details
- `POST /fuel-station/operators` - Add new operator
- `GET /fuel-station/operators` - List all operators
- `DELETE /fuel-station/operators/{id}` - Remove operator

### Transaction Management
- `POST /transactions/scan-qr` - Scan vehicle QR code
- `POST /transactions/pump-fuel` - Record fuel pumping
- `GET /transactions/my-transactions` - Get operator transactions
- `GET /transactions/vehicle/{vehicleId}` - Get vehicle transactions
- `GET /transactions/fuel-station/{stationId}` - Get station transactions

### Mobile API (For Android App)
- `POST /mobile/api/auth/login` - Mobile operator login
- `POST /mobile/api/scan-qr` - Scan QR code
- `POST /mobile/api/pump-fuel` - Pump fuel transaction
- `GET /mobile/api/operator/profile` - Get operator profile
- `GET /mobile/api/operator/transactions/today` - Today's transactions
- `GET /mobile/api/operator/stats` - Operator statistics

### Admin Operations
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/users` - List all users
- `GET /admin/fuel-stations` - List all fuel stations
- `PUT /admin/fuel-stations/{id}/approve` - Approve fuel station
- `GET /admin/transactions` - List all transactions
- `GET /admin/reports/fuel-consumption` - Fuel consumption report

## 🔐 Security

The application uses JWT (JSON Web Token) for authentication:

1. Login with credentials to receive JWT token
2. Include token in Authorization header: `Bearer {token}`
3. Token expires after 24 hours

## 📊 Database Schema

### Main Tables
- `users` - Authentication and user management
- `vehicle_owners` - Vehicle owner details
- `vehicles` - Registered vehicles
- `fuel_stations` - Registered fuel stations
- `fuel_station_operators` - Station operators
- `fuel_quotas` - Weekly fuel quotas
- `fuel_transactions` - Fuel pumping records
- `audit_logs` - System audit trail

### Mock DMT Database
- `vehicle_registry` - Mock vehicle registration data

## 🧪 Testing

### Using Postman

1. Import the API collection (if available)
2. Set up environment variables:
   - `base_url`: `http://localhost:8080`
   - `token`: JWT token after login

### Sample API Calls

**Login:**
```json
POST /auth/login
{
  "usernameOrEmail": "vehicle_owner1",
  "password": "password123"
}
```

**Register Vehicle:**
```json
POST /vehicle-owner/vehicles
Headers: Authorization: Bearer {token}
{
  "vehicleNumber": "WP CAB-1234",
  "vehicleType": "CAR",
  "fuelType": "PETROL",
  "engineCapacity": 1500,
  "ownerNic": "199012345678V"
}
```

**Pump Fuel (Mobile):**
```json
POST /mobile/api/pump-fuel
Headers: Authorization: Bearer {operator_token}
{
  "vehicleId": 1,
  "pumpedLiters": 10.5,
  "unitPrice": 450.00
}
```

## 🚀 Deployment

### Production Configuration

1. Update `application-prod.properties`:
   - Database credentials
   - JWT secret key
   - External service URLs
   - SMS/Email service credentials

2. Build for production:
```bash
mvn clean package -Pprod
```

3. Run the JAR:
```bash
java -jar target/fuel-quota-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## 📝 Features

- ✅ JWT Authentication & Authorization
- ✅ Vehicle Registration with DMT Validation
- ✅ QR Code Generation for Vehicles
- ✅ Fuel Station Registration & Approval
- ✅ Operator Management
- ✅ Real-time Quota Tracking
- ✅ SMS Notifications (Twilio)
- ✅ Transaction Recording
- ✅ Admin Dashboard
- ✅ Audit Logging
- ✅ Scheduled Quota Reset (Weekly)
- ✅ Mobile API for Android App

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Group project for INTE 31273
- Maximum 6 members per group

## 📞 Support

For issues and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Note:** Remember to commit your work regularly to the Git repository. Do not wait until the last moment!
