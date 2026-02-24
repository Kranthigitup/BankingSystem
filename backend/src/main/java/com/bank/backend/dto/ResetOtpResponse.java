package com.bank.backend.dto;

public class ResetOtpResponse {

    private String message;
    private String otp;

    public ResetOtpResponse(String message, String otp) {
        this.message = message;
        this.otp = otp;
    }

    public String getMessage() {
        return message;
    }

    public String getOtp() {
        return otp;
    }
}
