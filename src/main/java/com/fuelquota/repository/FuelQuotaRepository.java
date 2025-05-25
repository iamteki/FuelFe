package com.fuelquota.repository;

import com.fuelquota.entity.FuelQuota;
import com.fuelquota.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FuelQuotaRepository extends JpaRepository<FuelQuota, Long> {
    
    Optional<FuelQuota> findByVehicleAndWeekStartDate(Vehicle vehicle, LocalDate weekStartDate);
    
    @Query("SELECT fq FROM FuelQuota fq WHERE fq.vehicle.id = :vehicleId AND :date BETWEEN fq.weekStartDate AND fq.weekEndDate")
    Optional<FuelQuota> findCurrentQuota(@Param("vehicleId") Long vehicleId, @Param("date") LocalDate date);
    
    List<FuelQuota> findByVehicle(Vehicle vehicle);
    
    @Query("SELECT fq FROM FuelQuota fq WHERE fq.weekEndDate < :date")
    List<FuelQuota> findExpiredQuotas(@Param("date") LocalDate date);
}