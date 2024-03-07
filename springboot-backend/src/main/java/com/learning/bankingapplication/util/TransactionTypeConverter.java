package com.learning.bankingapplication.util;

import com.learning.bankingapplication.entity.Transaction;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;

@Converter
public class TransactionTypeConverter implements AttributeConverter<Transaction.TransactionType, Integer> {


    @Override
    public Integer convertToDatabaseColumn(Transaction.TransactionType transType) {
        return transType.getTransactionTypeId();
    }

    @Override
    public Transaction.TransactionType convertToEntityAttribute(Integer transId) {
        return Arrays.stream(Transaction.TransactionType.values())
                .filter(a -> a.getTransactionTypeId() == transId)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
