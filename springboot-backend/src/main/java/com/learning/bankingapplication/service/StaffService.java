package com.learning.bankingapplication.service;


import com.learning.bankingapplication.entity.Staff;

import java.util.List;
import java.util.Optional;

public interface StaffService {

    public Staff save(Staff s);
    public Staff update(Staff s);
    public Optional<Staff> findById(Integer id);
    public Optional<Staff> findByUsername(String username);
    public List<Staff> findAll();
    public Optional<Staff> delete(Integer id);

}
