package com.learning.bankingapplication.util;

import com.learning.bankingapplication.entity.Customer;
import com.learning.bankingapplication.entity.Staff;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;

@Converter
public class StaffStatusConverter implements AttributeConverter<Staff.Status, Integer> {
    @Override
    public Integer convertToDatabaseColumn(Staff.Status status) {
        return status.getStatusId();
    }

    @Override
    public Staff.Status convertToEntityAttribute(Integer statusId) {
        return Arrays.stream(Staff.Status.values())
                .filter(s -> s.getStatusId() == statusId)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
