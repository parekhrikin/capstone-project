package com.learning.bankingapplication.entity;

import com.learning.bankingapplication.util.AccountTypeConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BEN_TABLE")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Beneficiary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int beneficiaryNumber;

    private int accountNumber;
    private int customerId;
    @Convert(converter = AccountTypeConverter.class)
    private Account.AccountType accountType;
    private String approved;
}
