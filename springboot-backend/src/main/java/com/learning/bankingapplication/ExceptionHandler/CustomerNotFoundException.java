package com.learning.bankingapplication.ExceptionHandler;

public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String message) { super(message); }
}
