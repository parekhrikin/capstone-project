package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Beneficiary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryService {

    public Beneficiary createBeneficiary(Beneficiary acc, int accountId);

    public List<Beneficiary> findAll();

    public Optional<Beneficiary> findById(Integer beneficiaryId);

    public Beneficiary update(Optional<Beneficiary> b);

    public String delete(Integer beneficiaryId);

}
