package com.fuelquota.repository;

import com.fuelquota.entity.FuelStation;
import com.fuelquota.entity.FuelTransaction;
import com.fuelquota.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FuelTransactionRepository extends JpaRepository<FuelTransaction, Long> {
    
    List<FuelTransaction> findByVehicle(Vehicle vehicle);
    
    Page<FuelTransaction> findByVehicle(Vehicle vehicle, Pageable pageable);
    
    List<FuelTransaction> findByFuelStation(FuelStation fuelStation);
    
    Page<FuelTransaction> findByFuelStation(FuelStation fuelStation, Pageable pageable);
    
    @Query("SELECT ft FROM FuelTransaction ft WHERE ft.vehicle.id = :vehicleId ORDER BY ft.transactionDate DESC")
    List<FuelTransaction> findByVehicleId(@Param("vehicleId") Long vehicleId);
    
    @Query("SELECT ft FROM FuelTransaction ft WHERE ft.fuelStation.id = :stationId ORDER BY ft.transactionDate DESC")
    List<FuelTransaction> findByFuelStationId(@Param("stationId") Long stationId);
    
    @Query("SELECT ft FROM FuelTransaction ft WHERE ft.operator.id = :operatorId ORDER BY ft.transactionDate DESC")
    List<FuelTransaction> findByOperatorId(@Param("operatorId") Long operatorId);
    
    @Query("SELECT ft FROM FuelTransaction ft WHERE ft.transactionDate BETWEEN :startDate AND :endDate")
    List<FuelTransaction> findTransactionsBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}