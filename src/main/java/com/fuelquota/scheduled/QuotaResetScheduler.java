package com.fuelquota.scheduled;

import com.fuelquota.service.QuotaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class QuotaResetScheduler {

    private final QuotaService quotaService;

    // Run every Monday at 00:00
    @Scheduled(cron = "${quota.reset.cron:0 0 0 * * MON}")
    public void resetWeeklyQuotas() {
        log.info("Running scheduled weekly quota reset");
        try {
            quotaService.resetWeeklyQuotas();
        } catch (Exception e) {
            log.error("Error during weekly quota reset", e);
        }
    }
}