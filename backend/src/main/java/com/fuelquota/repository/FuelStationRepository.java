package com.fuelquota.repository;

import com.fuelquota.entity.FuelStation;
import com.fuelquota.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuelStationRepository extends JpaRepository<FuelStation, Long> {
    
    Optional<FuelStation> findByStationCode(String stationCode);
    
    Boolean existsByStationCode(String stationCode);
    
    List<FuelStation> findByIsActiveTrue();
    
    List<FuelStation> findByManager(User manager);
    
    List<FuelStation> findByCity(String city);
    
    List<FuelStation> findByProvince(String province);
    
    @Query("SELECT f FROM FuelStation f WHERE f.petrolStock > 0 AND f.isActive = true")
    List<FuelStation> findStationsWithPetrolStock();
    
    @Query("SELECT f FROM FuelStation f WHERE f.dieselStock > 0 AND f.isActive = true")
    List<FuelStation> findStationsWithDieselStock();
    
    @Query("SELECT f FROM FuelStation f WHERE " +
           "LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.stationCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.city) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<FuelStation> searchStations(@Param("keyword") String keyword);
    
    @Query("SELECT f FROM FuelStation f WHERE f.latitude BETWEEN :minLat AND :maxLat " +
           "AND f.longitude BETWEEN :minLon AND :maxLon AND f.isActive = true")
    List<FuelStation> findStationsNearby(@Param("minLat") Double minLat, 
                                       @Param("maxLat") Double maxLat,
                                       @Param("minLon") Double minLon, 
                                       @Param("maxLon") Double maxLon);
}
