package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Beneficiary;
import com.learning.bankingapplication.repo.BeneficiaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BeneficiaryServiceImpl implements BeneficiaryService {

    @Autowired
    BeneficiaryRepository beneficiaryRepository;

    @Override
    public Beneficiary createBeneficiary(Beneficiary acc, int accountId) {
        return beneficiaryRepository.save(acc);
    }

    @Override
    public List<Beneficiary> findAll() {
        return beneficiaryRepository.findAll();
    }

    @Override
    public Optional<Beneficiary> findById(Integer beneficiaryId) {
        return beneficiaryRepository.findById(beneficiaryId);
    }

    @Override
    public Beneficiary update(Optional<Beneficiary> b) {
        return beneficiaryRepository.save(b.get());
    }

    @Override
    public String delete(Integer beneficiaryId) {
        beneficiaryRepository.deleteById(beneficiaryId);
        return "Beneficiary with ID " + beneficiaryId + " deleted.";
    }
}
