package Baito.order.model;

import Baito.product.product.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    private Long productId;        // Store product ID directly (loose coupling)
    private String productName;    // Store product name for reference
    private Double productPrice;   // Store product price for reference

    private Integer quantity;

    private Long createdAt = System.currentTimeMillis();
}
