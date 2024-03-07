package com.learning.bankingapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor(staticName = "build")
@NoArgsConstructor
public class CustomerDTO {
    private int customerId;
    private String customerName;
    private String status;
}
