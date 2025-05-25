package com.fuelquota.repository;

import com.fuelquota.entity.FuelStation;
import com.fuelquota.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuelStationRepository extends JpaRepository<FuelStation, Long> {
    
    Optional<FuelStation> findByRegistrationNumber(String registrationNumber);
    
    Optional<FuelStation> findByOwnerUser(User ownerUser);
    
    List<FuelStation> findByIsActive(Boolean isActive);
    
    Page<FuelStation> findByIsActive(Boolean isActive, Pageable pageable);
    
    @Query("SELECT fs FROM FuelStation fs WHERE fs.approvedBy IS NULL")
    List<FuelStation> findPendingApproval();
    
    @Query("SELECT fs FROM FuelStation fs WHERE fs.approvedBy IS NULL")
    Page<FuelStation> findPendingApproval(Pageable pageable);
    
    boolean existsByRegistrationNumber(String registrationNumber);
    
    List<FuelStation> findByDistrict(String district);
    
    List<FuelStation> findByProvince(String province);
}