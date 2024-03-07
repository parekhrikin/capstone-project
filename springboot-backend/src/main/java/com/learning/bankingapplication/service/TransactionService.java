package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Transaction;

import java.util.List;
import java.util.Optional;

public interface TransactionService {
    public String transfer(Transaction t);
    public List<Transaction> findAll();
    public Optional<Transaction> findById(Integer transId);
    public Transaction update(Optional<Transaction> t);
    public void delete(Integer transId);
}
