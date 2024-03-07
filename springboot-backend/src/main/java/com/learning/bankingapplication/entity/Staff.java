package com.learning.bankingapplication.entity;

import com.learning.bankingapplication.util.CustomerStatusConverter;
import com.learning.bankingapplication.util.StaffStatusConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "STAFF_TABLE")
@Data
@AllArgsConstructor(staticName = "build")
@NoArgsConstructor
public class Staff {

    public enum Status {
        ENABLED(1),
        DISABLED(2);

        int statusId;
        private Status(int statusId) {
            this.statusId = statusId;
        }

        public int getStatusId() {
            return statusId;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String username;
    private String fullname;
    private String password;
    private String roles;
    @Convert(converter = StaffStatusConverter.class)
    private Status status;
}
