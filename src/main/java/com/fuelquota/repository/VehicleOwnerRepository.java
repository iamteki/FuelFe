package com.fuelquota.repository;

import com.fuelquota.entity.VehicleOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleOwnerRepository extends JpaRepository<VehicleOwner, Long> {
    
    Optional<VehicleOwner> findByUserId(Long userId);
    
    Optional<VehicleOwner> findByNic(String nic);
    
    boolean existsByNic(String nic);
}