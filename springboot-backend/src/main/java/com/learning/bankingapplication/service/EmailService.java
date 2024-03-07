package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Account;
import com.learning.bankingapplication.entity.Customer;
import com.learning.bankingapplication.entity.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EmailService
{
    public void sendRegisterEmail(Customer customer)
    {
        log.info("Sending registration email to customer {}", customer);
    }

    public void sendCustomerRemovedEmail(Customer customer)
    {
        log.info("Sending removed email for customer {}", customer);
    }

    public void sendAccountRemovedEmail(Account account)
    {
        log.info("Sending removed email for account {}", account);
    }

    public void sendTransactionEmail(Transaction transaction)
    {
        log.info("Sending email for transaction {}", transaction);
    }
}
