package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Staff;
import com.learning.bankingapplication.repo.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Staff save(Staff s) {

        s.setRoles("ROLE_STAFF");
        s.setPassword(passwordEncoder.encode(s.getPassword()));
        s.setStatus(Staff.Status.ENABLED);

        return staffRepository.save(s);
    }

    @Override
    public Staff update(Staff s) {
        return staffRepository.save(s);
    }

    @Override
    public Optional<Staff> findById(Integer id) {
        return staffRepository.findById(id);
    }

    @Override
    public Optional<Staff> findByUsername(String username) {
        return staffRepository.findByUsername(username);
    }

    @Override
    public List<Staff> findAll() {
        return staffRepository.findAll();
    }

    @Override
    public Optional<Staff> delete(Integer id) {
        Optional<Staff> s = staffRepository.findById(id);
        staffRepository.deleteById(id);
        return s;
    }

}
