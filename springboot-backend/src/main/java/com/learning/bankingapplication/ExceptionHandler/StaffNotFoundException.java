package com.learning.bankingapplication.ExceptionHandler;

public class StaffNotFoundException extends RuntimeException {
    public StaffNotFoundException(String message) { super(message); }
}
