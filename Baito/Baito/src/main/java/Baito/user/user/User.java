package Baito.user.user;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;


    @NotNull(message = "Email is required.")
    @Email(message = "Please enter a valid email address.")
    @Column(unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;


    @Column(unique = true)
    private String contact;
    @Column(nullable = false)
    private String address;

    public User(String name, String address, String contact, String email, String password) {
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.email = email;
        this.password = password;
    }


    public User() {
    }


}
