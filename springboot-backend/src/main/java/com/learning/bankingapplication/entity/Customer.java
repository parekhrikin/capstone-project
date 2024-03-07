package com.learning.bankingapplication.entity;

import com.learning.bankingapplication.util.CustomerStatusConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "CUST_TABLE")
@Data
@AllArgsConstructor(staticName = "build")
@NoArgsConstructor
public class Customer{

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
    @Convert(converter = CustomerStatusConverter.class)
    private Status status;

    @Nullable
    private String phone;

    @Nullable
    private String pan;

    @Nullable
    private String aadhar;

    @Nullable
    private String secretQuestion;

    @Nullable
    private String secretAnswer;

    @Nullable
    @Transient
    private MultipartFile panFile;

    @Nullable
    @Transient
    private MultipartFile aadharFile;
}
