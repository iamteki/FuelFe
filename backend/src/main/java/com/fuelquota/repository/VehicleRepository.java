package com.fuelquota.repository;

import com.fuelquota.entity.Vehicle;
import com.fuelquota.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    
    Boolean existsByRegistrationNumber(String registrationNumber);
    
    List<Vehicle> findByOwner(User owner);
    
    List<Vehicle> findByOwnerId(Long ownerId);
    
    List<Vehicle> findByIsRegisteredTrue();
    
    List<Vehicle> findByIsRegisteredFalse();
    
    @Query("SELECT v FROM Vehicle v WHERE v.vehicleType = :vehicleType AND v.isRegistered = true")
    List<Vehicle> findByVehicleTypeAndIsRegisteredTrue(@Param("vehicleType") String vehicleType);
    
    @Query("SELECT v FROM Vehicle v WHERE v.fuelType = :fuelType AND v.isRegistered = true")
    List<Vehicle> findByFuelTypeAndIsRegisteredTrue(@Param("fuelType") String fuelType);
    
    @Query("SELECT v FROM Vehicle v WHERE " +
           "LOWER(v.registrationNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.make) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Vehicle> searchVehicles(@Param("keyword") String keyword);
    
    @Query("SELECT v FROM Vehicle v WHERE v.currentQuota > 0 AND v.isRegistered = true")
    List<Vehicle> findVehiclesWithQuota();
}
