package com.learning.bankingapplication.entity;

import com.learning.bankingapplication.dto.CustomerDTO;
import com.learning.bankingapplication.util.AccountTypeConverter;
import com.learning.bankingapplication.util.TransactionTypeConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "TRANS_TABLE")
@Data
@AllArgsConstructor(staticName = "build")
@NoArgsConstructor
public class Transaction {

    public enum TransactionType {
        CR(1),
        DB(2);

        int transTypeId;

        private TransactionType(int accountTypeId) { this.transTypeId = accountTypeId; }

        public int getTransactionTypeId() { return transTypeId; }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int sender;
    private int recipient;
    private LocalDateTime dateTime;
    private int amount;
    @Convert(converter = TransactionTypeConverter.class)
    private TransactionType transactionType;
    private int createdBy;
}
