package com.fuelquota.service.impl;

import com.fuelquota.entity.FuelTransaction;
import com.fuelquota.entity.enums.FuelType;
import com.fuelquota.repository.FuelTransactionRepository;
import com.fuelquota.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final FuelTransactionRepository transactionRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public Map<String, Object> generateTransactionReport(String startDate, String endDate) {
        LocalDateTime start = startDate != null ? 
                LocalDate.parse(startDate, DATE_FORMATTER).atStartOfDay() : 
                LocalDate.now().minusMonths(1).atStartOfDay();
        
        LocalDateTime end = endDate != null ? 
                LocalDate.parse(endDate, DATE_FORMATTER).atTime(23, 59, 59) : 
                LocalDate.now().atTime(23, 59, 59);

        List<FuelTransaction> transactions = transactionRepository.findTransactionsBetweenDates(start, end);

        Map<String, Object> report = new HashMap<>();
        report.put("period", Map.of("start", start, "end", end));
        report.put("totalTransactions", transactions.size());
        
        BigDecimal totalLiters = transactions.stream()
                .map(FuelTransaction::getPumpedLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.put("totalLitersPumped", totalLiters);
        
        BigDecimal totalRevenue = transactions.stream()
                .map(t -> t.getTotalAmount() != null ? t.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.put("totalRevenue", totalRevenue);
        
        // Group by fuel type
        Map<FuelType, BigDecimal> fuelTypeBreakdown = transactions.stream()
                .collect(Collectors.groupingBy(
                        FuelTransaction::getFuelType,
                        Collectors.reducing(BigDecimal.ZERO, 
                                FuelTransaction::getPumpedLiters, 
                                BigDecimal::add)
                ));
        report.put("fuelTypeBreakdown", fuelTypeBreakdown);
        
        // Daily breakdown
        Map<LocalDate, Long> dailyTransactions = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getTransactionDate().toLocalDate(),
                        Collectors.counting()
                ));
        report.put("dailyBreakdown", dailyTransactions);
        
        return report;
    }

    @Override
    public Map<String, Object> generateFuelConsumptionReport(String period) {
        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();
        
        switch (period != null ? period.toLowerCase() : "month") {
            case "week":
                start = end.minusWeeks(1);
                break;
            case "year":
                start = end.minusYears(1);
                break;
            case "month":
            default:
                start = end.minusMonths(1);
                break;
        }

        List<FuelTransaction> transactions = transactionRepository.findTransactionsBetweenDates(start, end);

        Map<String, Object> report = new HashMap<>();
        report.put("period", period != null ? period : "month");
        report.put("dateRange", Map.of("start", start, "end", end));
        
        // Calculate average daily consumption
        long days = start.toLocalDate().until(end.toLocalDate()).getDays() + 1;
        BigDecimal totalLiters = transactions.stream()
                .map(FuelTransaction::getPumpedLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal avgDailyConsumption = days > 0 ? 
                totalLiters.divide(BigDecimal.valueOf(days), 2, java.math.RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
        
        report.put("totalConsumption", totalLiters);
        report.put("averageDailyConsumption", avgDailyConsumption);
        report.put("totalTransactions", transactions.size());
        
        // Vehicle type consumption
        Map<String, BigDecimal> vehicleTypeConsumption = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getVehicle().getVehicleType().toString(),
                        Collectors.reducing(BigDecimal.ZERO,
                                FuelTransaction::getPumpedLiters,
                                BigDecimal::add)
                ));
        report.put("vehicleTypeConsumption", vehicleTypeConsumption);
        
        return report;
    }

    @Override
    public Map<String, Object> generateStationPerformanceReport(Long stationId) {
        List<FuelTransaction> transactions = transactionRepository.findByFuelStationId(stationId);
        
        Map<String, Object> report = new HashMap<>();
        report.put("stationId", stationId);
        report.put("totalTransactions", transactions.size());
        
        BigDecimal totalLiters = transactions.stream()
                .map(FuelTransaction::getPumpedLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.put("totalLitersSold", totalLiters);
        
        BigDecimal totalRevenue = transactions.stream()
                .map(t -> t.getTotalAmount() != null ? t.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.put("totalRevenue", totalRevenue);
        
        // Operator performance
        Map<String, Long> operatorTransactions = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getOperator().getFullName(),
                        Collectors.counting()
                ));
        report.put("operatorPerformance", operatorTransactions);
        
        return report;
    }
}