package com.fuelquota.repository;

import com.fuelquota.entity.Vehicle;
import com.fuelquota.entity.VehicleOwner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    
    Optional<Vehicle> findByQrCode(String qrCode);
    
    List<Vehicle> findByVehicleOwner(VehicleOwner vehicleOwner);
    
    Page<Vehicle> findByVehicleOwner(VehicleOwner vehicleOwner, Pageable pageable);
    
    boolean existsByVehicleNumber(String vehicleNumber);
    
    @Query("SELECT v FROM Vehicle v WHERE v.vehicleOwner.user.id = :userId")
    List<Vehicle> findByOwnerId(Long userId);
    
    @Query("SELECT v FROM Vehicle v WHERE v.vehicleOwner.user.id = :userId")
    Page<Vehicle> findByOwnerId(Long userId, Pageable pageable);
}