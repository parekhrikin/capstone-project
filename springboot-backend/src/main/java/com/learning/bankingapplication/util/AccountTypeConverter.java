package com.learning.bankingapplication.util;

import com.learning.bankingapplication.entity.Account;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;

@Converter
public class AccountTypeConverter implements AttributeConverter<Account.AccountType, Integer> {


    @Override
    public Integer convertToDatabaseColumn(Account.AccountType accountType) {
        return accountType.getAccountTypeId();
    }

    @Override
    public Account.AccountType convertToEntityAttribute(Integer accountId) {
        return Arrays.stream(Account.AccountType.values())
                .filter(a -> a.getAccountTypeId() == accountId)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
