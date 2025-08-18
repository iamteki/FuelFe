# Create database
CREATE DATABASE IF NOT EXISTS fuel_quota_db;
USE fuel_quota_db;

# Create tables (these will be created automatically by Hibernate, but here's the reference)

# Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(120) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    nic_number VARCHAR(20),
    role ENUM('ADMIN', 'STATION_MANAGER', 'VEHICLE_OWNER', 'OPERATOR') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

# Vehicles table
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    manufacture_year INT,
    vehicle_type ENUM('CAR', 'MOTORCYCLE', 'THREE_WHEELER', 'VAN', 'LORRY', 'BUS', 'TRUCK') NOT NULL,
    fuel_type ENUM('PETROL', 'DIESEL') NOT NULL,
    engine_capacity DOUBLE,
    weekly_quota DOUBLE,
    current_quota DOUBLE,
    last_quota_reset TIMESTAMP,
    qr_code_path VARCHAR(255),
    is_registered BOOLEAN DEFAULT FALSE,
    registration_date TIMESTAMP,
    owner_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

# Fuel stations table
CREATE TABLE fuel_stations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    station_code VARCHAR(20) UNIQUE NOT NULL,
    address VARCHAR(200),
    city VARCHAR(50),
    province VARCHAR(50),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    petrol_stock DOUBLE DEFAULT 0.0,
    diesel_stock DOUBLE DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    operating_hours VARCHAR(100),
    manager_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

# Fuel transactions table
CREATE TABLE fuel_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    fuel_station_id BIGINT NOT NULL,
    fuel_type ENUM('PETROL', 'DIESEL') NOT NULL,
    quantity DOUBLE NOT NULL,
    price_per_liter DOUBLE NOT NULL,
    total_amount DOUBLE NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED') DEFAULT 'PENDING',
    remarks TEXT,
    processed_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (fuel_station_id) REFERENCES fuel_stations(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

# Insert sample data
INSERT INTO users (username, email, password, first_name, last_name, role) VALUES
('admin', 'admin@fuelquota.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System', 'Admin', 'ADMIN'),
('johndoe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'VEHICLE_OWNER');

INSERT INTO fuel_stations (name, station_code, address, city, province, petrol_stock, diesel_stock) VALUES
('Shell Colombo Central', 'SH001', '123 Galle Road, Colombo 03', 'Colombo', 'Western', 5000.0, 8000.0),
('IOC Kandy Station', 'IOC002', '456 Peradeniya Road, Kandy', 'Kandy', 'Central', 3000.0, 6000.0),
('Ceypetco Galle', 'CP003', '789 Matara Road, Galle', 'Galle', 'Southern', 4000.0, 7000.0);
