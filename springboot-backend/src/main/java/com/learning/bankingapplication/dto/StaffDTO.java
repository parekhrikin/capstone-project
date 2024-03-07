package com.learning.bankingapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor(staticName = "build")
@NoArgsConstructor
public class StaffDTO {
    private int staffId;
    private String staffName;
    private String status;
}
