package com.learning.bankingapplication.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeCreator;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.learning.bankingapplication.ExceptionHandler.CustomerNotFoundException;
import com.learning.bankingapplication.ExceptionHandler.StaffNotFoundException;
import com.learning.bankingapplication.dto.AuthRequest;
import com.learning.bankingapplication.dto.CustomerDTO;
import com.learning.bankingapplication.entity.*;
import com.learning.bankingapplication.service.*;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffController {

    @Autowired
    StaffService staffService;

    @Autowired
    CustomerService customerService;

    @Autowired
    AccountService accountService;

    @Autowired
    TransactionService transactionService;

    @Autowired
    BeneficiaryService beneficiaryService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

//    @PostMapping("/register")
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
//    public ResponseEntity registerStaff(@RequestBody Staff s) {
//
//        if(staffService.findByUsername(s.getUsername()).isPresent() || customerService.findByUsername(s.getUsername()).isPresent()){
//            return new ResponseEntity<>("Username already exists.", HttpStatus.FORBIDDEN);
//        }
//
//        return new ResponseEntity<>(staffService.save(s), HttpStatus.CREATED);
//    }

    @PostMapping("/authenticate")
    public String authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
//        List<GrantedAuthority> authorities = new ArrayList<>();
//        authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
//        System.out.println(authentication.getAuthorities().stream().findFirst().get().getAuthority().equals("ROLE_CUST"));
        if(authentication.getAuthorities().stream().findFirst().get().getAuthority().equals("ROLE_CUST")){
            throw new UsernameNotFoundException("This username does not exist in the staff database.");
        }

        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(authRequest.getUsername());
        } else {
            throw new UsernameNotFoundException("invalid user request !");
        }
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<Optional<Staff>> getStaffByUsername(@PathVariable String username) throws StaffNotFoundException {
        return ResponseEntity.ok(staffService.findByUsername(username));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity fetchAllCustomers() throws JsonProcessingException {
//        List<Customer> customers = customerService.findAll();
//        List<JsonNode> resList = new ArrayList<>();
//        ObjectMapper objectMapper = new ObjectMapper();
//
//        for(Customer c: customers) {
//            String jsonString = objectMapper.writeValueAsString(c);
//
//            JsonNode jsonNode = objectMapper.readTree(jsonString);
//
//            resList.add(jsonNode);
//        }
//
//        return ResponseEntity.ok(resList);
        List<Customer> customers = customerService.findAll();
        List<CustomerDTO> dtos = new ArrayList<>();

        for (Customer customer : customers) {
            CustomerDTO dto = new CustomerDTO();
            dto.setCustomerId(customer.getId());
            dto.setCustomerName(customer.getUsername());
            dto.setStatus(customer.getStatus().toString());
            dtos.add(dto);
        }

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/customer/{id}")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity findCustomerById(@PathVariable int id) throws StaffNotFoundException {
        Optional<Customer> customer = customerService.findById(id);

        if(!customer.isPresent()){
            return new ResponseEntity<>("Customer Not Found", HttpStatus.FORBIDDEN);
        }

        CustomerDTO dto = new CustomerDTO();
        dto.setCustomerId(customer.get().getId());
        dto.setCustomerName(customer.get().getUsername());
        dto.setStatus(customer.get().getStatus().toString());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/customer")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity enableDisableCustomer(@RequestBody JsonNode body) {
        if(!customerService.findById(body.get("customerId").asInt()).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Customer> customer = customerService.findById(body.get("customerId").asInt());

        customer.get().setStatus(Customer.Status.valueOf(body.get("status").asText()));

        return ResponseEntity.ok(customerService.update(customer));
    }

    @GetMapping("/accounts/approve")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity listPendingAccountApprovals() {
        List<Account> accounts = accountService.findAll();

        List<Account> filteredAccounts = accounts.stream()
                .filter(account -> "No".equals(account.getApproved()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(filteredAccounts);
    }

    @PutMapping("/accounts/approve")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity approveCustomerAccounts(@RequestBody JsonNode body){
        if(!accountService.findById(body.get("accountNumber").asInt()).isPresent()){
            return new ResponseEntity<>("Account Number "+ body.get("accountNumber").asInt() +" doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Account> account = accountService.findById(body.get("accountNumber").asInt());

        if(account.get().getApproved().equals("No")){
            account.get().setApproved(body.get("approved").asText());
        }

        accountService.update(account);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/beneficiary")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity listPendingBeneficiaryApprovals() {
        List<Beneficiary> beneficiaries = beneficiaryService.findAll();


        List<Beneficiary> filteredBens = beneficiaryService.findAll()
                .stream()
                .filter(beneficiary -> "No".equals(beneficiary.getApproved()))
                .collect(Collectors.toList());


        if(beneficiaries.isEmpty()){
            return new ResponseEntity<>("No beneficiaries to be approved.", HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(filteredBens);
    }

    @PutMapping("/beneficiary")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity approveBeneficiary(@RequestBody JsonNode body) {
        if(!customerService.findById(body.get("fromCustomer").asInt()).isPresent()){
            return new ResponseEntity<>("Customer ID doesn't exist.", HttpStatus.FORBIDDEN);
        } else if(!beneficiaryService.findById(body.get("beneficiaryAcNo").asInt()).isPresent()){
            return new ResponseEntity<>("Beneficiary ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Beneficiary> ben = beneficiaryService.findById(body.get("beneficiaryAcNo").asInt());

        if(ben.get().getApproved().equals("No")){
            ben.get().setApproved(body.get("approved").asText());
        }

        return ResponseEntity.ok(beneficiaryService.update(ben));
    }

    @PutMapping("/transfer")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
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
        t.setCreatedBy(payload.get("by").get("customerId").asInt());

        transactionService.transfer(t);

        return ResponseEntity.ok("Transaction completed.");

    }


    @GetMapping("/account/{accNo}")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity fetchStatement(@PathVariable int accNo) {
        if(!accountService.findById(accNo).isPresent()){
            return new ResponseEntity<>("Sending Account ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Account> account = accountService.findById(accNo);
        Optional<Customer> customer = customerService.findById(account.get().getCustomerId());
        List<Transaction> transactions = transactionService.findAll();

        ObjectMapper objectMapper = new ObjectMapper();

        ArrayNode res = objectMapper.createArrayNode();
        for(Transaction t: transactions){
            if(t.getSender() == accNo || t.getRecipient() == accNo){
                ObjectNode transObj = objectMapper.createObjectNode();
                transObj.put("id", t.getId());
                transObj.put("amount", t.getAmount());
                transObj.put("sender", t.getSender());
                transObj.put("recipient", t.getRecipient());
                transObj.put("createdDate", t.getDateTime().toString());
                transObj.put("transactionType", t.getTransactionType().toString());
                transObj.put("createdBy", t.getCreatedBy());
                res.add(transObj);
            }
        }


        ObjectNode obj = objectMapper.createObjectNode();

        obj.put("accountNo", accNo);
        obj.put("customerName", customer.get().getFullname());
        obj.put("balance", account.get().getAccountBalance());
        obj.put("transactions", res);

        JsonNode jsonNode = (JsonNode) obj;

        return ResponseEntity.ok(jsonNode);
    }


}
