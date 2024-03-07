package com.learning.bankingapplication.config;

import com.learning.bankingapplication.entity.Staff;
import com.learning.bankingapplication.repo.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StaffDetailsService implements UserDetailsService {

    @Autowired
    private StaffRepository staffRepository;

    public boolean existsByUsername(String username) {
        return staffRepository.findByUsername(username).isPresent();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Staff> staff = staffRepository.findByUsername(username);
        return staff.map(StaffDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("user not found " + username));
    }
}
