package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Transaction;
import com.learning.bankingapplication.events.TransactionCompletedEvent;
import com.learning.bankingapplication.repo.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    AccountService accountService;

    private final ApplicationEventPublisher publisher;

    public TransactionServiceImpl(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    @Override
    @Transactional
    public String transfer(Transaction t) {
        log.info("checking account balance and updating it for Account with ID ", t.getSender());
        if(!accountService.checkAccountBalance(t.getSender(), t.getAmount())){
            return "The sender account does not have enough funds.";
        }
        accountService.deductAmount(t.getSender(), t.getAmount());

        log.info("Adding money to recipient's account");
        accountService.addAmount(t.getRecipient(), t.getAmount());

        log.info("creating transaction:", t);
        transactionRepository.save(t);
        log.info("Publishing transaction completed event");
        publisher.publishEvent(new TransactionCompletedEvent(t));
        return "event published.";
    }

    @Override
    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    @Override
    public Optional<Transaction> findById(Integer transId) {
        return transactionRepository.findById(transId);
    }

    @Override
    public Transaction update(Optional<Transaction> t) {
        return transactionRepository.save(t.get());
    }

    @Override
    public void delete(Integer transId) {
        transactionRepository.deleteById(transId);
    }
}
