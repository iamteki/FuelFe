package com.fuelquota.integration.sms;

import com.fuelquota.integration.sms.dto.SMSRequest;

public interface SMSProvider {
    void sendSMS(SMSRequest smsRequest);
}