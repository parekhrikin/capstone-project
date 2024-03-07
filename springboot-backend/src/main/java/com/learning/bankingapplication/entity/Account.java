package com.learning.bankingapplication.entity;

import com.learning.bankingapplication.util.AccountTypeConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "ACC_TABLE")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {

    public enum AccountType {
        SB(1),
        CA(2);

        int accountTypeId;

        private AccountType(int accountTypeId) { this.accountTypeId = accountTypeId; }

        public int getAccountTypeId() { return accountTypeId; }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int accountNumber;
    @Convert(converter = AccountTypeConverter.class)
    private AccountType accountType;
    private int accountBalance;
    private String approved;
    private LocalDateTime dateOfCreation;
    private int customerId;
    private String beneficiary;
}
