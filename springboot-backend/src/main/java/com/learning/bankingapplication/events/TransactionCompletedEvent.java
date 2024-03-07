package com.learning.bankingapplication.events;

import com.learning.bankingapplication.entity.Transaction;
import lombok.Data;

@Data
public class TransactionCompletedEvent {
    private final Transaction transaction;
}
