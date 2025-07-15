package com.eventwave.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.eventwave.exception.ApiException;

@Service
public class OtpService {

    private final Map<String, OtpDetails> otpStore = new ConcurrentHashMap<>();

    private final long OTP_EXPIRY_MINUTES = 5;
    private final long RATE_LIMIT_SECONDS = 60;
    
    private final Set<String> verifiedEmails = ConcurrentHashMap.newKeySet();

    public String generateOtp(String email) {
        OtpDetails existing = otpStore.get(email);
        if (existing != null && !isRateLimitPassed(existing.getGeneratedAt())) {
            throw new ApiException("rate_limit", "Please wait before requesting another OTP.");
        }

        String otp = String.format("%04d", new Random().nextInt(10000));
        otpStore.put(email, new OtpDetails(otp, LocalDateTime.now()));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpDetails details = otpStore.get(email);
        if (details == null || isExpired(details.getGeneratedAt())) {
            otpStore.remove(email);
            return false;
        }

        if (details.getOtp().equals(otp)) {
            verifiedEmails.add(email);
            otpStore.remove(email);
            return true;
        }

        return false;
    }

    public boolean isEmailVerified(String email) {
        return verifiedEmails.contains(email);
    }

    public void removeVerifiedEmail(String email) {
        verifiedEmails.remove(email);
    }


    private boolean isExpired(LocalDateTime time) {
        return Duration.between(time, LocalDateTime.now()).toMinutes() >= OTP_EXPIRY_MINUTES;
    }

    private boolean isRateLimitPassed(LocalDateTime time) {
        return Duration.between(time, LocalDateTime.now()).getSeconds() >= RATE_LIMIT_SECONDS;
    }

    public static class OtpDetails {
        private String otp;
        private LocalDateTime generatedAt;

        public OtpDetails(String otp, LocalDateTime generatedAt) {
            this.otp = otp;
            this.generatedAt = generatedAt;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }

        public LocalDateTime getGeneratedAt() {
            return generatedAt;
        }

        public void setGeneratedAt(LocalDateTime generatedAt) {
            this.generatedAt = generatedAt;
        }
    }
}


