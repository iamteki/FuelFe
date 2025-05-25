package com.fuelquota.repository;

import com.fuelquota.entity.FuelStation;
import com.fuelquota.entity.FuelStationOperator;
import com.fuelquota.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuelStationOperatorRepository extends JpaRepository<FuelStationOperator, Long> {
    
    Optional<FuelStationOperator> findByUser(User user);
    
    Optional<FuelStationOperator> findByUserId(Long userId);
    
    List<FuelStationOperator> findByFuelStation(FuelStation fuelStation);
    
    List<FuelStationOperator> findByFuelStationAndIsActive(FuelStation fuelStation, Boolean isActive);
    
    boolean existsByEmployeeId(String employeeId);
}