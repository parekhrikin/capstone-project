package com.learning.bankingapplication.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.learning.bankingapplication.ExceptionHandler.CustomerNotFoundException;
import com.learning.bankingapplication.dto.AuthRequest;
import com.learning.bankingapplication.dto.CustomerDTO;
import com.learning.bankingapplication.entity.Account;
import com.learning.bankingapplication.entity.Beneficiary;
import com.learning.bankingapplication.entity.Customer;
import com.learning.bankingapplication.entity.Transaction;
import com.learning.bankingapplication.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    CustomerService customerService;

    @Autowired
    StaffService staffService;

    @Autowired
    AccountService accountService;

    @Autowired
    BeneficiaryService beneficiaryService;

    @Autowired
    TransactionService transactionService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity registerCustomer(@RequestBody Customer c) throws CustomerNotFoundException {

        if(customerService.findByUsername(c.getUsername()).isPresent() || staffService.findByUsername(c.getUsername()).isPresent()){
            return new ResponseEntity<>("Username already exists.", HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(customerService.save(c), HttpStatus.CREATED);
    }

    @PostMapping("/authenticate")
    public String authenticateAndGetToken(@RequestBody AuthRequest authRequest) throws CustomerNotFoundException {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        if(authentication.getAuthorities().stream().findFirst().get().getAuthority().equals("ROLE_STAFF")){
            throw new UsernameNotFoundException("This username does not exist in the customer database.");
        }
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(authRequest.getUsername());
        } else {
            throw new UsernameNotFoundException("invalid user request !");
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity<Optional<Customer>> getCustomerById(@PathVariable int id) throws CustomerNotFoundException {
        return ResponseEntity.ok(customerService.findById(id));
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity<Optional<Customer>> getCustomerByUsername(@PathVariable String username) throws CustomerNotFoundException {
        return ResponseEntity.ok(customerService.findByUsername(username));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity updateCustomerById(@PathVariable int id, @RequestBody JsonNode customer) throws CustomerNotFoundException {

        if(!customerService.findById(id).isPresent()){
            String errorMessage = "Customer with ID " + id + " not found";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        Optional<Customer> c = customerService.findById(id);


//        c.get().setId(customer.get("customerId").asInt());
        c.get().setFullname(customer.get("fullname").asText());
        c.get().setPhone(customer.get("phone").asText());
        c.get().setPan(customer.get("pan").asText());
        c.get().setAadhar(customer.get("aadhar").asText());
        c.get().setSecretQuestion(customer.get("secretQuestion").asText());
        c.get().setSecretAnswer(customer.get("secretAnswer").asText());

        return ResponseEntity.ok(customerService.update(c));
    }

    @PutMapping("/{username}/forgot")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity<String> updatePassword(@PathVariable String username, @RequestBody AuthRequest authRequest) throws CustomerNotFoundException {
        if (username == null || username.isEmpty()) {
            String errorMessage = "Username path variable is missing.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }

        if(!customerService.findByUsername(username).isPresent()){
            String errorMessage = "Customer with username " + username + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        Optional<Customer> customer = customerService.findByUsername(username);

        customer.get().setPassword(passwordEncoder.encode(authRequest.getPassword()));
        customerService.update(customer);

        return ResponseEntity.status(HttpStatus.OK).body("New password updated.");
    }

    @PostMapping("/{id}/account")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity createAccount(@PathVariable int id, @RequestBody JsonNode body) {

        if(!customerService.findById(id).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Account account = new Account();
        account.setAccountBalance(body.get("accountBalance").asInt());
        account.setAccountType(Account.AccountType.valueOf(body.get("accountType").asText()));

        return ResponseEntity.ok(accountService.createAccount(account, id));
    }

    @GetMapping("/{id}/account")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity fetchAllAccounts(@PathVariable int id) {
        if(!customerService.findById(id).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        List<Account> allAccounts = accountService.findAll();
        List<Account> accounts = new ArrayList<>();

        for(Account acc: allAccounts){
            if(id == acc.getCustomerId()){
                accounts.add(acc);
            }
        }

        return ResponseEntity.ok(accounts);
    }



    @PutMapping("/{id}/account/{accountNo}")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity approveAccount(@PathVariable int id, @PathVariable int accountNo, @RequestBody Account newAccount) {
        if(!customerService.findById(id).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Account> account = accountService.findById(accountNo);

        if(!account.isPresent()){
            return new ResponseEntity<>("Account Not Found", HttpStatus.FORBIDDEN);
        }

        account.get().setApproved(String.valueOf(newAccount.getApproved()));

        return ResponseEntity.ok(accountService.update(account));
    }



    @GetMapping("/{id}/account/{accountNo}")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity fetchAccountById(@PathVariable int id, @PathVariable int accountNo) {
        if(!customerService.findById(id).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Account> account = accountService.findById(accountNo);

        if(account.isEmpty()){
            return new ResponseEntity<>("Account with ID " + accountNo + "Not Found", HttpStatus.FORBIDDEN);
        }

        return ResponseEntity.ok(account);
    }

    @GetMapping("/{custId}/beneficiary/all")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity getAllBeneficiaries(@PathVariable int custId){
        if(!customerService.findById(custId).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        List<Beneficiary> allBens = beneficiaryService.findAll();
        List<Beneficiary> bens = new ArrayList<>();

        allBens.stream()
                .filter(ben -> ben.getCustomerId() == custId)
                .forEach(bens::add);

        return ResponseEntity.ok(bens);
    }

    @PostMapping("/{custId}/beneficiary")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity addBeneficiary(@PathVariable int custId, @RequestBody JsonNode body) {
        if(!customerService.findById(custId).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Account> account = accountService.findById(body.get("accountNumber").asInt());

        if(account.isEmpty()){
            return new ResponseEntity<>("Account with ID " + accountService.findById(body.get("accountNumber").asInt()) + "Not Found", HttpStatus.FORBIDDEN);
        }

        //Since default approved status is Yes
//        if(body.get("beneficiaryType").equals("No")){
//
//        }

        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setAccountNumber(body.get("accountNumber").asInt());
        beneficiary.setCustomerId(custId);
        beneficiary.setAccountType(Account.AccountType.valueOf(body.get("accountType").asText()));
        beneficiary.setApproved("Yes");

        return ResponseEntity.ok(beneficiaryService.createBeneficiary(beneficiary, account.get().getAccountNumber()));
    }

    @GetMapping("/{custId}/beneficiary")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity fetchBeneficiariesByCustId(@PathVariable int custId) {
        if(!customerService.findById(custId).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        List<Beneficiary> filteredBens = beneficiaryService.findAll()
                .stream()
                .filter(beneficiary -> beneficiary.getCustomerId() == custId)
                .collect(Collectors.toList());

        return ResponseEntity.ok(filteredBens);
    }

    @DeleteMapping("/{custId}/beneficiary/{benId}")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity deleteBeneficiaryById(@PathVariable int custId, @PathVariable int benId) {
        if(!customerService.findById(custId).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        } else if(!beneficiaryService.findById(benId).isPresent()){
            return new ResponseEntity<>("Beneficiary ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        return ResponseEntity.ok(beneficiaryService.delete(benId));

    }

    @GetMapping("/{username}/forgot/question/{answer}")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity validateSecretAnswer(@PathVariable String username, @PathVariable String answer) {
        if(!customerService.findByUsername(username).isPresent()){
            return new ResponseEntity<>("Customer username doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Customer> customer = customerService.findByUsername(username);

        if(!customer.get().getSecretAnswer().equals(answer)){
            return new ResponseEntity<>("Sorry your secret details are not matching", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Details validated");
    }

    @PutMapping("/transfer")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity transferMoney(@RequestBody JsonNode payload) {
        int sender = payload.get("fromAccNumber").asInt();
        int recipient = payload.get("toAccNumber").asInt();
        int amount = payload.get("amount").asInt();

        if(!accountService.findById(sender).isPresent()){
            return new ResponseEntity<>("Sending Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        } else if(!accountService.findById(recipient).isPresent()){
            return new ResponseEntity<>("Recipient Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Transaction t = new Transaction();
        t.setSender(sender);
        t.setRecipient(recipient);
        t.setAmount(amount);
        t.setDateTime(LocalDateTime.now());
        t.setTransactionType(Transaction.TransactionType.CR);
        t.setCreatedBy(payload.get("customerId").asInt());

        transactionService.transfer(t);

        return ResponseEntity.ok("Transaction completed.");

    }

    @GetMapping("/{accountNumber}/viewStatement")
    @PreAuthorize("hasAuthority('ROLE_CUST')")
    public ResponseEntity viewStatement(@PathVariable int accountNumber){
        if(!accountService.findById(accountNumber).isPresent()){
            return new ResponseEntity<>("Sending Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        List<Transaction> allTransactions = transactionService.findAll();
        List<Transaction> myTransactions = new ArrayList<>();
        allTransactions.stream()
                .filter(t -> t.getSender() == accountNumber || t.getRecipient() == accountNumber)
                .forEach(myTransactions::add);
        return ResponseEntity.ok(myTransactions);
    }
}
