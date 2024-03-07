package com.learning.bankingapplication.listeners;

import com.learning.bankingapplication.events.TransactionCompletedEvent;
import com.learning.bankingapplication.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class EmailListeners
{
    private final EmailService emailService;

//    @EventListener
//    public void onRegisterEvent(CustomerRegisteredEvent event)
//    {
//        emailService.sendRegisterEmail(event.getCustomer());
//    }
//
//    @EventListener
//    public void onCustomerRemovedEvent(CustomerRemovedEvent event)
//    {
//        emailService.sendCustomerRemovedEmail(event.getCustomer());
//    }

    @TransactionalEventListener
    public void onOrderCompletedEvent(TransactionCompletedEvent event)
    {
        emailService.sendTransactionEmail(event.getTransaction());
    }

}
