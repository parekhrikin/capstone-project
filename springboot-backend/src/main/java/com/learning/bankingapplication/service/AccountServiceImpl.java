package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Account;
import com.learning.bankingapplication.repo.AccountRepository;
import com.learning.bankingapplication.repo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    AccountRepository accountRepository;
    @Autowired
    private CustomerRepository customerRepository;


    @Override
    public Account createAccount(Account acc, int customerId) {
        acc.setDateOfCreation(LocalDateTime.now());
        acc.setCustomerId(customerId);
        acc.setApproved("Yes");
        acc.setBeneficiary("Yes");
        return accountRepository.save(acc);
    }

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    @Override
    public Optional<Account> findById(Integer accountNo) {
        return accountRepository.findById(accountNo);
    }

    @Override
    public Account update(Optional<Account> a) {


        return accountRepository.save(a.get());
    }

    @Override
    public Optional<Account> delete(Integer accountNo) {
        return Optional.empty();
    }

    @Override
    public boolean checkAccountBalance(Integer accNo, Integer amount){
        Optional<Account> acc = findById(accNo);
        return acc.get().getAccountBalance() > amount ? true : false;
    }

    @Override
    public void deductAmount(Integer accNo, Integer amount) {
        Optional<Account> acc = findById(accNo);
        acc.get().setAccountBalance(acc.get().getAccountBalance() - amount);
        accountRepository.save(acc.get());
    }

    @Override
    public void addAmount(Integer accNo, Integer amount) {
        Optional<Account> acc = findById(accNo);
        acc.get().setAccountBalance(acc.get().getAccountBalance() + amount);
        accountRepository.save(acc.get());
    }


}
