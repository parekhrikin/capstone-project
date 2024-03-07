package com.learning.bankingapplication.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.learning.bankingapplication.dto.AuthRequest;
import com.learning.bankingapplication.dto.StaffDTO;
import com.learning.bankingapplication.entity.Staff;
import com.learning.bankingapplication.service.CustomerService;
import com.learning.bankingapplication.service.JwtService;
import com.learning.bankingapplication.service.StaffService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    StaffService staffService;

    @Autowired
    CustomerService customerService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @PostMapping("/staff")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity registerStaff(@RequestBody Staff s) {

        if(staffService.findByUsername(s.getUsername()).isPresent() || customerService.findByUsername(s.getUsername()).isPresent()){
            return new ResponseEntity<>("Username already exists.", HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(staffService.save(s), HttpStatus.CREATED);
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity fetchAllStaff() {
        List<Staff> staff = staffService.findAll();
        List<StaffDTO> dtos = new ArrayList<>();

        for (Staff s: staff) {
            StaffDTO dto = new StaffDTO();
            dto.setStaffId(s.getId());
            dto.setStaffName(s.getFullname());
            dto.setStatus(s.getStatus().toString());
            dtos.add(dto);
        }

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/authenticate")
    public String validateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(authRequest.getUsername());
        } else {
            throw new UsernameNotFoundException("invalid user request !");
        }
    }

    @PutMapping("/staff")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity enableDisableStaff(@RequestBody JsonNode body) {
        if(!staffService.findById(body.get("staffId").asInt()).isPresent()){
            return new ResponseEntity<>("Staff ID doesn't exist.", HttpStatus.FORBIDDEN);
        }

        Optional<Staff> staff = staffService.findById(body.get("staffId").asInt());

        staff.get().setStatus(Staff.Status.valueOf(body.get("status").asText()));

        return ResponseEntity.ok(staffService.update(staff.get()));
    }

}
