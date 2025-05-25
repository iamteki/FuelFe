# Fuel Quota Management System - Backend

A comprehensive fuel quota management system built with Spring Boot to manage fuel distribution during crisis situations. This system enables vehicle registration, QR code generation, fuel station management, and real-time quota tracking.

## 🚀 Technology Stack

- **Framework:** Spring Boot 3.x
- **Language:** Java 21
- **Database:** MySQL 8.0
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security + JWT
- **API Documentation:** Swagger/OpenAPI 3.0
- **Build Tool:** Maven
- **IDE:** Apache NetBeans IDE 21

## 📋 Prerequisites

- JDK 21 or higher
- MySQL 8.0 or higher
- Maven 3.6+
- Apache NetBeans IDE 21 (recommended)
- Git

## 🛠️ Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fuel-quota-backend
```

### 2. Database Setup

Create two databases for the main application and mock DMT service:

```sql
-- Create main database
CREATE DATABASE IF NOT EXISTS fuel_quota_db;

-- Create mock DMT database
CREATE DATABASE IF NOT EXISTS motor_traffic_db;
```

Run the SQL scripts from `databases.txt` to create all required tables.

### 3. Configure Application Properties

Update `src/main/resources/application.properties`:

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
