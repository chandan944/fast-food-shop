package Baito;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Duplicate key (email/contact) error
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateKey(DataIntegrityViolationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Email or Contact already exists ❌");
        error.put("details", ex.getMostSpecificCause().getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error); // 409 Conflict
    }

    // User not found
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage()); // "User not found" or "Password is incorrect"
        error.put("details", "Check your input");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // Optional → any other backend crashes
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralError(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Something went wrong on the server 🛑");
        error.put("details", ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

