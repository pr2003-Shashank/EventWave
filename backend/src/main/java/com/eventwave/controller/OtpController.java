package com.eventwave.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventwave.dto.ApiResponse;
import com.eventwave.dto.EmailRequest;
import com.eventwave.dto.OtpVerifyRequest;
import com.eventwave.service.EmailService;
import com.eventwave.service.OtpService;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ApiResponse sendOtp(@RequestBody EmailRequest request) {
        String otp = otpService.generateOtp(request.getEmail());
        String body = "Your EventWave OTP is: " + otp + ". It will expire in 5 minutes.";
        emailService.sendSimpleEmail(request.getEmail(), "EventWave OTP Verification", body);
        return new ApiResponse("success", "OTP sent to email");
    }

    @PostMapping("/verify")
    public ApiResponse verifyOtp(@RequestBody OtpVerifyRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (isValid) {
            return new ApiResponse("success", "OTP verified");
        }
        return new ApiResponse("failed", "Invalid or expired OTP");
    }
}

