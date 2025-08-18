package com.fuelquota.repository;

import com.fuelquota.entity.FuelTransaction;
import com.fuelquota.entity.Vehicle;
import com.fuelquota.entity.FuelStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FuelTransactionRepository extends JpaRepository<FuelTransaction, Long> {
    
    List<FuelTransaction> findByVehicle(Vehicle vehicle);
    
    List<FuelTransaction> findByVehicleId(Long vehicleId);
    
    List<FuelTransaction> findByFuelStation(FuelStation fuelStation);
    
    List<FuelTransaction> findByFuelStationId(Long fuelStationId);
    
    @Query("SELECT f FROM FuelTransaction f WHERE f.status = :status")
    List<FuelTransaction> findByStatus(@Param("status") String status);
    
    @Query("SELECT f FROM FuelTransaction f WHERE f.transactionDate BETWEEN :startDate AND :endDate")
    List<FuelTransaction> findTransactionsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                                      @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT f FROM FuelTransaction f WHERE f.vehicle.id = :vehicleId " +
           "AND f.transactionDate BETWEEN :startDate AND :endDate")
    List<FuelTransaction> findVehicleTransactionsBetweenDates(@Param("vehicleId") Long vehicleId,
                                                             @Param("startDate") LocalDateTime startDate,
                                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT f FROM FuelTransaction f WHERE f.fuelStation.id = :stationId " +
           "AND f.transactionDate BETWEEN :startDate AND :endDate")
    List<FuelTransaction> findStationTransactionsBetweenDates(@Param("stationId") Long stationId,
                                                             @Param("startDate") LocalDateTime startDate,
                                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(f.quantity) FROM FuelTransaction f WHERE f.vehicle.id = :vehicleId " +
           "AND f.fuelType = :fuelType AND f.status = 'COMPLETED' " +
           "AND f.transactionDate BETWEEN :startDate AND :endDate")
    Double getTotalFuelConsumptionByVehicle(@Param("vehicleId") Long vehicleId,
                                           @Param("fuelType") String fuelType,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(f) FROM FuelTransaction f WHERE f.vehicle.id = :vehicleId " +
           "AND DATE(f.transactionDate) = DATE(:date)")
    Long countDailyTransactionsByVehicle(@Param("vehicleId") Long vehicleId, 
                                        @Param("date") LocalDateTime date);
}
