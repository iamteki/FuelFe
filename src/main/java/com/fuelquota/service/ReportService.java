package com.fuelquota.service;

import java.util.Map;

public interface ReportService {
    Map<String, Object> generateTransactionReport(String startDate, String endDate);
    Map<String, Object> generateFuelConsumptionReport(String period);
    Map<String, Object> generateStationPerformanceReport(Long stationId);
}