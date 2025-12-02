package Baito.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UserRequest(
        String name,
        @NotBlank(message = "Email is mandatory") String email,
        @NotBlank(message = "Password is mandatory") String password,
        String contact,
        String address) {
    public String getEmail() {
        return this.email;
    }

    public CharSequence getPassword() {
        return this.password;
    }
}
