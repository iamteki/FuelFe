package com.mockdmt.repository;

import com.mockdmt.entity.VehicleRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRegistryRepository extends JpaRepository<VehicleRegistry, Long> {
    
    Optional<VehicleRegistry> findByVehicleNumber(String vehicleNumber);
    
    Optional<VehicleRegistry> findByVehicleNumberAndOwnerNic(String vehicleNumber, String ownerNic);
    
    boolean existsByVehicleNumber(String vehicleNumber);
}