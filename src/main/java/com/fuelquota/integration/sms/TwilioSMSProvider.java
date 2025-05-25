package com.fuelquota.integration.sms;

import com.fuelquota.integration.sms.dto.SMSRequest;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TwilioSMSProvider implements SMSProvider {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    @PostConstruct
    public void init() {
        // Initialize Twilio only if credentials are provided
        if (!"YOUR_TWILIO_ACCOUNT_SID".equals(accountSid)) {
            Twilio.init(accountSid, authToken);
        }
    }

    @Override
    public void sendSMS(SMSRequest smsRequest) {
        try {
            // For development, just log the message
            if ("YOUR_TWILIO_ACCOUNT_SID".equals(accountSid)) {
                log.info("SMS (Dev Mode) - To: {}, Message: {}", smsRequest.getTo(), smsRequest.getMessage());
                return;
            }

            Message message = Message.creator(
                    new PhoneNumber(smsRequest.getTo()),
                    new PhoneNumber(fromPhoneNumber),
                    smsRequest.getMessage()
            ).create();

            log.info("SMS sent successfully. SID: {}", message.getSid());
        } catch (Exception e) {
            log.error("Failed to send SMS to {}", smsRequest.getTo(), e);
            throw new RuntimeException("Failed to send SMS", e);
        }
    }
}